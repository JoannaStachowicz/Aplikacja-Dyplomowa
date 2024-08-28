// realizacja endpointów z pliku routes/auth.js - autentykacja uzytkownika:

// funkcja rejestrująca - sprawdzenie istnienia uzytkownika w bazie danych
// jesli nie istnieje i hasła w formularzu są takie same - mozna załozyć mu konto z zahaszowanym hasłem

// funkcja logująca - sprawdzenie istnienia uzytkownika w bazie danych oraz zgodności emailu z hasłem

// funkcja wylogowująca - czyści pliki cookies uzytkownika

import { db } from "../connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from '../config.js';


export const register = (req, res) => {

    const { first_name, surname, pesel, email, phone_number, pwd, confirm_pwd } = req.body;

    const q = "SELECT * FROM users WHERE email = $1 OR pesel = $2";
    const values_1 = [email, pesel];

    db.query(q, values_1, (err, data) => {

        if (err) return res.status(500).json(err);
        if(data.rows.length) return res.status(409).json("Użytkownik o podanym adresie e-mail lub peselu już istnieje.");


        if (pwd !== confirm_pwd) return res.status(409).json("Hasła są różne.");

        // liczba rund "solanki"
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(pwd, salt);

        const q = "INSERT INTO users (first_name, surname, pesel, email, phone_number, pwd) VALUES ($1, $2, $3, $4, $5, $6)"
        const values = [
            first_name,
            surname,
            pesel,
            email,
            phone_number,
            hash,
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Konto zostało utworzone.");
        });
    });
};


export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE email = $1"
    const temp = [req.body.email]

    db.query(q, temp, (err, data) => {

        if (err) return res.status(500).json(err);
        if (data.rows.length === 0) return res.status(404).json("Nie znaleziono użytkownika.");

        const isPwdCorr = bcrypt.compareSync(req.body.pwd, data.rows[0].pwd); 

        if (!isPwdCorr) return res.status(400).json("Niepoprawny e-mail lub hasło.");

        const secretKey = jwtSecretKey;

        const token = jwt.sign({id:data.rows[0].id}, secretKey); 
        const {pwd, ...other} = data.rows[0] 

        res.cookie("access_token", token, {
            httpOnly : true 
        }).status(200).json(other)
    })
};


export const logout = (req, res) => {
    res.clearCookie("access_token", {
        someSite:"none", // inny port do strony backendu i klienckiej
        secure:true
    }).status(200).json("Użytkownik wylogowany.")

};
