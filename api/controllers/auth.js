import { db } from "../connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from '../config.js';


// yarn add jsonwebtoken cookie-parser cors (cors-umozliwiamy korzystanie z api tylko localhost:3000)


export const register = (req, res) => {

    // Destrukturyzacja obiektów --> technika w JavaScript, która pozwala wyodrębnić właściwości obiektu i przypisać je do zmiennych w jednym kroku dzięki temu bedziemy mogli uzywac nazw zmiennych zamiast req.body.*nazwa*

    const { first_name, surname, pesel, email, phone_number, pwd, confirm_pwd } = req.body;

    /* w pierwszej kolejnosci będziemy sprawdzac, czy w bazie danych
    // znajduje sie user, ktory chce sie zarejestrowac
    jesli tak - error z message "user already exists" */

    // uzywanie $1 zamiast email to rodzaj dodatkowego zabezpieczenia

    const q = "SELECT * FROM users WHERE email = $1 OR pesel = $2";
    const values_1 = [email, pesel];

    // po wykoaniu query otrzymamy albo error, albo jakies dane
    db.query(q, values_1, (err, data) => {

        if (err) return res.status(500).json(err);
        if(data.rows.length) return res.status(409).json("Użytkownik o podanym adresie e-mail już istnieje.");

        // jezeli nie ma takiego usera w BD - stworz usera
        //  - sprawdz, czy haslo i potwierdzenie hasla sa takie same
        //  - jesli tak - zahashuj haslo

        if (pwd !== confirm_pwd) return res.status(409).json("Hasła są różne.");
        // liczba rund solanek=12
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(pwd, salt);

        // dodajemy usera do bazy danych

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

    // przydaloby sie zrobic case dla przypadku, gdy email jest w bazie danych, ale haslo do niego nie pasuje

    // jezeli nie ma podanego usera - error (nie znaleziono uzytkownika)

    const q = "SELECT * FROM users WHERE email = $1"
    const temp = [req.body.email]

    db.query(q, temp, (err, data) => {

        if (err) return res.status(500).json(err);
        if (data.rows.length === 0) return res.status(404).json("Nie znaleziono użytkownika.");

        // jesli podany mail jest w bazie danych - sprawdz, czy haslo sie zgadza

        const isPwdCorr = bcrypt.compareSync(req.body.pwd, data.rows[0].pwd); //data[0], bo mamy tam cos poza userem, a chcemy usera

        if (!isPwdCorr) return res.status(400).json("Niepoprawny e-mail lub hasło.");

        const secretKey = jwtSecretKey;

        const token = jwt.sign({id:data.rows[0].id}, secretKey); // potrzebujemy czegos identyfikujacego konkretnego uzytkownika, drugi argument to secret key
        const {pwd, ...other} = data.rows[0] // bo będziemy chcieli zwracac wszystkie informacje o userze, z wyjatkiem hasla


        res.cookie("access_token", token, {
            httpOnly : true // losowy skrypt nie bedzie mogl uzywac naszych cookies
        }).status(200).json(other)


    })

};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        someSite:"none", // inny port do strony backendu i klienckiej
        secure:true
    }).status(200).json("Użytkownik wylogowany.")

};
