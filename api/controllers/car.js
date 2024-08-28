// realizacja endpointów z pliku routes/cars.js

import { jwtSecretKey } from "../config.js";
import { db } from "../connection.js";
import jwt from "jsonwebtoken";

// potrzebujemy wyswietlenia naszego uzytkownika -> 
// poniewaz korzystamy z plikow cookie, mamy dostęp do tokenu uzytkownika,
// za posrednictwem jsonwebtoken
// w tokenie mamy user id i z tego będziemy korzystac przy klauzulach select... where id = userid

export const getCars = (req, res) => {


    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;


    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT v.* FROM users u INNER JOIN vehicles_users vu ON u.id = vu.user_id INNER JOIN vehicles v ON vu.vehicle_id = v.id WHERE u.id = $1 AND ownership_end_date IS NULL";

        db.query(q, [userData.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data.rows)
        });

    });
};

// car registration 


export const regCar = (req, res) => {

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const client = await db.connect();

        try {


            // transakcja w celu utrzymania atomowosci dwoch zapytan - dodawania rejestrowanego pojazdu, dodawania rekordu do vehicles_users w celu powiązania dodanego pojazdu z zalogowanym uzytkownikiem

            await client.query('BEGIN');

            const q = `INSERT INTO vehicles (vehicle_type, vin, make, model, body_style, 
            registration_number, production_year, fuel_type, first_side_homologation_doc, second_side_homologation_doc, technical_inspection_due_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`;


        // BADANIA TECHNICZNE:
        // PRZED UPŁYWEM TRZECH LAT OD PIERWSZEJ REJESTRACJI POJAZDU
        // CZYLI PODCZAS PROCESU REJESTRACJI USTAWIAMY
        // technical_inspection_due_date NA CURRENT DATE + 3 LATA
        // slice, zeby zmienna DATA dostosowac do formatu 'YYYY-MM-DD'

            const future_date = new Date();
            future_date.setFullYear(future_date.getFullYear() + 3);
            const tech_inspection_due_date = future_date.toISOString().slice(0, 10);

            const production_year = parseInt(req.body.production_year, 10);
            if (isNaN(production_year) || production_year < 1886) {
                return res.status(400).json({ error: "Invalid production year" });
            }

            const values = [
                req.body.vehicle_type,
                req.body.vin,
                req.body.make,
                req.body.model,
                req.body.body_style,
                req.body.registration_number,
                production_year,
                req.body.fuel_type,
                req.body.first_side_homologation_doc,
                req.body.second_side_homologation_doc,
                tech_inspection_due_date
            ];

            const q_res = await client.query(q, values);

            const new_vehicle_id = q_res.rows[0].id;

            // na rozpoczecie wlascicielstwa w przypadku nowego samochodu (nie odkupionego od innego wlasciciela) ustawiamy wartosc ownership_start_date na biezącą datę


            const q2 = 'INSERT INTO vehicles_users (vehicle_id, user_id, ownership_start_date) VALUES ($1, $2, $3)';
            const curr_date = new Date();
            const values2 = [new_vehicle_id, userData.id, curr_date]

            await client.query(q2, values2);
            await client.query('COMMIT');

            return res.status(200).json("Pojazd został zarejestrowany i powiązany z uzytkownikiem");

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
};