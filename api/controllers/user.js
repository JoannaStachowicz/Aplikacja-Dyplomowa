// realizacja endpointów z pliku routes/users.js

import { jwtSecretKey } from "../config.js";
import { db } from "../connection.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;


    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        // podczas logowania uzytkownika ustawiamy (w pliku auth) id:data.rows[0].id, wiec, gdy odwołujemy się do userData.id, mamy dostęp do id zalogowanego uzytkownika

        const q = "SELECT * FROM users WHERE id = $1";

        db.query(q, [userData.id], (err, data) => {
            if (err) return res.status(500).json(err);  

            return res.status(200).json(data.rows)
        });
    });
};


export const getDocument = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT documents.* FROM documents INNER JOIN users ON users.document_id = documents.id WHERE users.id = $1"

        db.query(q, [userData.id], (err, data) => {
            if (err) return res.status(500).json(err);  
            return res.status(200).json(data.rows)
        });
    });

};


export const getAddress = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;


    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        const q = "SELECT addresses.* FROM addresses INNER JOIN users ON users.address_id = addresses.id WHERE users.id = $1"

        db.query(q, [userData.id], (err, data) => {
            if (err) return res.status(500).json(err);  
            return res.status(200).json(data.rows)
        });
    });
};


export const addDoc = (req, res) => {
    const { document_type, document_number, issue_date, expiry } = req.body;

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;


    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        // korzystamy z transakcji dla zachowania atomowosci zapytan

        const client = await db.connect();

        try {

            // rozpoczecie transakcji

            await client.query('BEGIN');

            // 1) stworzenie nowego dokumentu (dodanie rekordu do documents)

            const q_insert = "INSERT INTO documents (document_type, document_number, issue_date, expiry) VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), TO_DATE($4, 'YYYY-MM-DD')) RETURNING id";
            const values_insert = [document_type, document_number, issue_date, expiry];
            const q_res = await client.query(q_insert, values_insert);

            const new_doc_id = q_res.rows[0].id;

            // 2) powiązanie dokumentu z zalogowanym uzytkownikiem

            const q_update = "UPDATE users SET document_id = $1 WHERE id = $2";
            const values_update = [new_doc_id, userData.id];
            await client.query(q_update, values_update);

            await client.query('COMMIT');
            return res.status(200).json("Dodano dokument.");

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


export const addAddress = (req, res) => {
    const { street, street_number, apartament_number, city, post_code, country } = req.body;

    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;


    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {

        if (err) return res.status(403).json("Niewazny token.");

        // korzystamy z transakcji dla zachowania atomowosci zapytan

        const client = await db.connect();

        try {

            // rozpoczecie transakcji

            await client.query('BEGIN');

            // 1) stworzenie nowego adresu (dodanie rekordu do addressess)

            const q_insert = "INSERT INTO addresses (street, street_number, apartament_number, city, post_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
            const values_insert = [street, street_number, apartament_number, city, post_code, country];
            const q_res = await client.query(q_insert, values_insert);

            const new_address_id = q_res.rows[0].id;

            // 2) powiązanie adresu z zalogowanym uzytkownikiem

            const q_update = "UPDATE users SET address_id = $1 WHERE id = $2";
            const values_update = [new_address_id, userData.id];
            await client.query(q_update, values_update);

            await client.query('COMMIT');
            return res.status(200).json("Dodano adres.");

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

export const changeUserInfo = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {
        const { first_name, surname, phone_number } = req.body 

        if (err) return res.status(403).json("Niewazny token.");

        const q = "UPDATE users SET first_name = $1, surname = $2, phone_number = $3 WHERE users.id = $4 AND users.id = userData.id";

        const values = [first_name, surname, phone_number, userData.id];


        db.query(q, values, (err, data) => {
            if(err) res.status(500).json(err)
            if(res.rowCount > 0) return res.json("Zaktualizowano dane użytkownika") 
        })

        console.log(res.data)
    })
};

export const changeDoc = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {
        const { document_type, document_number, issue_date, expiry } = req.body 

        if (err) return res.status(403).json("Niewazny token.");

        // korzystamy z transakcji w celu utrzymania atomowości operacji

        const client = await db.connect(); 
        try {
            await client.query('BEGIN'); 

            // 1) pobieramy id dokumentu do aktualizacji
            const q_getDocument = "SELECT document_id FROM users WHERE id = $1 FOR UPDATE"; 
            const result = await client.query(q_getDocument, [userData.id]);

            if (result.rows.length === 0 || result.rows[0].document_id === null) {
                await client.query('ROLLBACK'); 
                return res.status(404).json("Nie znaleziono dokumentu.");
            }

            const document_id = result.rows[0].document_id;

            // 2) aktualizujemy dokument o pobranym wcześniej id
            const q_update = `
                UPDATE documents 
                SET document_type = $1, document_number = $2, issue_date = $3, expiry = $4
                WHERE id = $5
            `;
            const values = [document_type, document_number, issue_date, expiry, document_id];
            const updateResult = await client.query(q_update, values);

            if (updateResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json("Nie znaleziono dokumentu do zaktualizowania.");
            }

            await client.query('COMMIT'); 
            return res.json("Zaktualizowano dane dokumentu.");

        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Błąd transakcji:", error);
            return res.status(500).json("Wystąpił błąd podczas aktualizacji danych dokumentu.");
        } finally {
            client.release();
        }
    });
};

export const changeAddress = (req, res) => {
    const token = req.cookies.access_token;
    const secretKey = jwtSecretKey;

    if (!token) return res.status(401).json("Uzytkownik niezalogowany.");

    jwt.verify(token, secretKey, async (err, userData) => {
        const { street, street_number, apartament_number, city, post_code, country } = req.body 

        if (err) return res.status(403).json("Niewazny token.");

        // korzystamy z transakcji w celu utrzymania atomowości operacji

        const client = await db.connect(); 
        try {
            await client.query('BEGIN'); 

            // 1) pobieramy id adresu do aktualizacji
            const q_getAddress = "SELECT address_id FROM users WHERE id = $1 FOR UPDATE"; 
            const result = await client.query(q_getAddress, [userData.id]);

            if (result.rows.length === 0 || result.rows[0].document_id === null) {
                await client.query('ROLLBACK'); 
                return res.status(404).json("Nie znaleziono adresu.");
            }

            const address_id = result.rows[0].address_id;

            // 2) aktualizujemy adres o pobranym wcześniej id
            const q_update = `
                UPDATE addresses 
                SET street = $1, street_number = $2, apartament_number = $3, city = $4, post_code = $5, country = $6
                WHERE id = $7
            `;
            const values = [street, street_number, apartament_number, city, post_code, country, address_id];
            const updateResult = await client.query(q_update, values);

            if (updateResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json("Nie znaleziono adresu do zaktualizowania.");
            }

            await client.query('COMMIT'); 
            return res.json("Zaktualizowano dane adresu");

        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Błąd transakcji:", error);
            return res.status(500).json("Wystąpił błąd podczas aktualizacji danych adresu.");
        } finally {
            client.release();
        }
    });
    
}; 