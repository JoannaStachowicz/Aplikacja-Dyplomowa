// widok strony do rejestracji

import "./register.scss"
import axios from "axios"
import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


const Register = () => {

    const [inputs, setInputs] = useState({
        first_name: "",
        surname: "",
        pesel: "",
        email: "",
        phone_number: "",
        pwd: "",
        confirm_pwd: ""
    })

    const [err, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))

    };

    console.log(inputs)

    const handleClick = async e => {
        e.preventDefault() /* zeby nam sie nie odswiezala strona i nie zerowaly dane po nacisnieciu guzika zarejestruj */
        try {
            await axios.post("/auth/register", inputs) 
            navigate("/login")
        } catch(err) {
            setError(err.response.data)   
        }
    };

    return (
    <div className="register">
        <h1>Rejestracja</h1>
        <form>
            <input type="text" placeholder="Imię" name="first_name" onChange={handleChange}/>
            <input type="text" placeholder="Nazwisko" name="surname" onChange={handleChange}/>
            <input type="text" placeholder="Pesel" name="pesel" onChange={handleChange}/>
            <input type="text" placeholder="E-mail" name="email" onChange={handleChange}/>
            <div className="phone_numbe_inputs">
                <input type="text" placeholder="+48123456789" className="phone_number" name="phone_number" onChange={handleChange}/>
            </div>
            <input type="password" placeholder="Hasło" name="pwd" onChange={handleChange}/>
            <input type="password" placeholder="Powtórz hasło" name="confirm_pwd" onChange={handleChange}/>
            <button onClick={handleClick}>Zarejestruj się</button>
            {err && <p> {err} </p>}
            <span>Masz konto? <Link to="/login">Zaloguj się</Link></span>
        </form>
    </div>
    )
}

export { Register };