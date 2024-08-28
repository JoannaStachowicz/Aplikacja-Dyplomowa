// funkcje, realizujace endpointy z pliku routes/changeOwners.js

import { db } from "../connection.js";
import { jwtSecretKey } from "../config.js";
import jwt from "jsonwebtoken";

// Pierwsza faza procedury zmiany właściciela - stworzenie formualrza

export const InitChangeOwn = (req, res) => {

    const { vehicle_id, pesel, first_name, surname, first_side_sale_agreement, second_side_sale_agreement } = req.body;

    if (isNaN(vehicle_id)) {
        return res.status(400).json({ message: "Invalid vehicle_id." });
    }

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    // sprawdzenie, czy użytkownik jest zalogowany

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT * FROM users WHERE pesel = $1 AND first_name = $2 AND surname = $3";
        const values_1 = [pesel, first_name, surname];

        db.query(q, values_1, async (err, data) => {

            // czy w bazie danych jest uzytkownik, ktorego user wskazal jako nabywce pojazdu

            if (err) return res.status(500).json(err);
            if (data.rows.length === 0) {
                console.log("dupa")
                return res.status(404).json("Nie znaleziono użytkownika.");
            }
            if (data.rows[0].id === userData.id) {
                return res.status(400).json({ message: "Nie można wysyłać formularzy do samego siebie xD" });
            }

            const new_owner_id = data.rows[0].id;
            const client = await db.connect();


            try {

                // rozpoczecie transakcji

                await client.query('BEGIN');

                const curr_date = new Date();
                

                // dodanie formularza odnosnie przenoszenia wlasnosci (domyslnie wartosc "oczekuje")

                const q3 = 'INSERT INTO forms (form_date, ex_owner_id, new_owner_id, form_vehicle_id, first_side_sale_agreement, second_side_sale_agreement) VALUES ($1, $2, $3, $4, $5, $6)';
                const values_form_insertion = [curr_date, userData.id, new_owner_id, vehicle_id, first_side_sale_agreement, second_side_sale_agreement];
                await client.query(q3, values_form_insertion);


                await client.query('COMMIT');

                return res.status(200).json("Formularz został wysłany do nabywcy.");

    
            } catch(err) {

                await client.query('ROLLBACK'); // cofanie zmian w przypadku błędu

                console.error("Błąd podczas transakcji: ", err.message);
                console.error("Szczegóły błędu: ", err.stack);
            
                return res.status(500).json({
                    message: "Wystąpił błąd podczas transakcji",
                    error: err.message 
                });
    
            } finally {
                client.release();
            }
        });

    })

};


export const FinishChangeOwn = (req, res) => {

    const { form_id, action } = req.body;
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    // sprawdzenie, czy użytkownik jest zalogowany
    if (!token) return res.status(401).json("Użytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {
        if (err) return res.status(403).json("Nieważny token.");

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            // wydobycie infromacji nt. formularza

            const q = 'SELECT * FROM forms WHERE id = $1 AND new_owner_id = $2 AND status = $3';
            const values_1 = [form_id, userData.id, 'oczekuje'];
            console.log(values_1)
            const formRes = await client.query(q, values_1);
            if (formRes.rows.length === 0) {
                return res.status(404).json({ message: "Nie znaleziono formularza." });
            }

            const form = formRes.rows[0];

            if (action === 'odrzuc') {

                // ustawienie statusu formularza na 'odrzucono'

                const updateQuery = 'UPDATE forms SET status = $1 WHERE id = $2';
                await client.query(updateQuery, ['odrzucono', form_id]);

                await client.query('COMMIT');
                return res.status(200).json("Transakcja została odrzucona.");

            } else if (action == 'potwierdz') { 
                
                const curr_date = new Date();

                // ustawienie daty "zakonczenia wlascicielstwa" na biezaca date

                const q = 'UPDATE vehicles_users SET ownership_end_date = $1 WHERE user_id = $2 AND vehicle_id = $3 AND ownership_end_date IS NULL';

                const values_update = [curr_date, form.ex_owner_id, form.form_vehicle_id]
                await client.query(q, values_update);


                // powiazanie sprzedawanego auta z nowym wlascicielem

                const q2 = 'INSERT INTO vehicles_users (user_id, vehicle_id, ownership_start_date) VALUES ($1, $2, $3)';
                const values_vehicles_users_insertion = [userData.id, form.form_vehicle_id, curr_date];
                await client.query(q2, values_vehicles_users_insertion);

                const updateQuery_accept = 'UPDATE forms SET status = $1 WHERE id = $2';
                const values_form_insertion = ['zaakceptowano', form_id];
                await client.query(updateQuery_accept, values_form_insertion);

                await client.query('COMMIT');
                return res.status(200).json("Transakcja została zaakceptowana.");

            };

        } catch(err) {
            await client.query('ROLLBACK'); // cofanie zmian w przypadku błędu

            console.error("Błąd podczas transakcji: ", err.message);
            console.error("Szczegóły błędu: ", err.stack);
        
            return res.status(500).json({
                message: "Wystąpił błąd podczas transakcji",
                error: err.message 
            })

        } finally {
            client.release();
        }

    });

};


export const getForms = (req, res) => { 

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        // chcemy wyswietlic wszystkie rekordy z tabeli forms, gdzie aktualnie zalogowany uzytkownik jest albo ex_ownerem albo new_ownerem

        //users u INNER JOIN vehicles_users vu ON u.id = vu.user_id
        const q = "SELECT f.id AS form_id, f.form_date, f.status, ex_owner.first_name AS ex_owner_first_name, ex_owner.surname AS ex_owner_surname, new_owner.first_name AS new_owner_first_name, new_owner.surname AS new_owner_surname, new_owner.id AS new_owner_id, f.form_vehicle_id FROM forms f INNER JOIN users ex_owner ON f.ex_owner_id = ex_owner.id INNER JOIN users new_owner ON f.new_owner_id = new_owner.id WHERE f.ex_owner_id = $1 OR f.new_owner_id = $1 ORDER BY CASE WHEN f.status = 'oczekuje' AND f.new_owner_id = $1 THEN 1 WHEN f.status = 'oczekuje' THEN 2 ELSE 3 END, f.form_date DESC;"

        db.query(q, [userData.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data.rows)
        });

    });
};


export const getForm = (req, res) => {

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT f.id AS form_id, f.form_date, f.status, ex_owner.first_name AS ex_owner_first_name, ex_owner.surname AS ex_owner_surname, new_owner.id AS new_owner_id, new_owner.first_name AS new_owner_first_name, new_owner.surname AS new_owner_surname, f.form_vehicle_id, v.make, v.model, v.registration_number FROM forms f INNER JOIN users ex_owner ON f.ex_owner_id = ex_owner.id INNER JOIN users new_owner ON f.new_owner_id = new_owner.id INNER JOIN vehicles v ON v.id = f.form_vehicle_id WHERE f.id = $1"

        db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data.rows)
        });
    });

}