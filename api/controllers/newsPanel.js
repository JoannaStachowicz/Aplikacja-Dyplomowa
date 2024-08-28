// funkcje, realizujące endpointy z pliku routes/newPanel.js

import { db } from "../connection.js";
import { jwtSecretKey } from "../config.js";
import jwt from "jsonwebtoken";

export const newForm = (req, res) => {

    const token = req.cookies.access_token;

    const secretKey = jwtSecretKey;

    // część do formularza aktualności z wyswietlaniem powiadomien w stanie "oczekuje"

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const userId = userData.id;
        const q = 'SELECT * FROM forms WHERE status = $1 AND new_owner_id = $2';
        const values_select = ['oczekuje', userId];

        try {

            const { rows } = await db.query(q, values_select);
            console.log(rows)
        
            if(rows.length > 0) {
                const news = rows.map(item => ({
                    category: "Nowy formularz",
                    value: `Masz nowy formularz o ID = ${item.id}`
                }))
                return res.status(200).json(news);

            };

        } catch(err) {

            return res.status(500).json(err);
        }
    });
};

export const infoTechInspect = (req, res) => {

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    // sprawdzenie, czy uzytkownik zalogowany

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT vehicles_users.*, vehicles.make, vehicles.model, vehicles.registration_number, vehicles.technical_inspection_due_date FROM vehicles_users INNER JOIN vehicles ON vehicles_users.vehicle_id = vehicles.id WHERE vehicles_users.user_id = $1 AND ownership_end_date IS NULL AND (TO_DATE(vehicles.technical_inspection_due_date, 'YYYY-MM-DD') < CURRENT_DATE OR TO_DATE(vehicles.technical_inspection_due_date, 'YYYY-MM-DD') BETWEEN TO_DATE($2, 'YYYY-MM-DD') AND TO_DATE($3, 'YYYY-MM-DD'));";

        const curr_date = new Date().toISOString().slice(0, 10); 
        const future_date = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10); 
        const values = [userData.id, curr_date, future_date];

        try {

            const { rows } = await db.query(q, values);
            
            const notifications = rows.map(vehicle => {
                const exp_tech_date = new Date(vehicle.technical_inspection_due_date);

                if (exp_tech_date < new Date(curr_date)) {
                    return {
                        category: "Przegląd techniczny - nieaktualny",
                        value: `Przegląd techniczny pojazdu: ${vehicle.make} ${vehicle.model} (${vehicle.registration_number}) upłynął: ${vehicle.technical_inspection_due_date}.`,
                    };
                } else {
                    return {
                        category: "Przegląd techniczny - zbliża się",
                        value: `Przegląd techniczny pojazdu: ${vehicle.make} ${vehicle.model} (${vehicle.registration_number}) wygasa ${vehicle.technical_inspection_due_date}.`,
                    };
                }
            });
            console.log(notifications)
            return res.status(200).json(notifications);

        } catch(err) {

            return res.status(500).json(err);
        }
    });
};
