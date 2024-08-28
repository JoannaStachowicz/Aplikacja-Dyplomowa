// strona do logowania uzytkownika

import "./login.scss"
import React, { useContext } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/authContext"

const Login = () => {

    const [inputs, setInputs] = useState({
        email: "",
        pwd: "",
    })

    const [err, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setInputs(prev=>({...prev, [e.target.name]: e.target.value}))

    };

    const {login} = useContext(AuthContext);
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await login(inputs);
            navigate("/")

        } catch(err) {
            setError(err.response.data);
        }
    };

    return (
    <div className="login">
        <h1>Logowanie</h1>
        <form>
            <input type="text" placeholder="E-mail" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Hasło" name="pwd" onChange={handleChange}/>
            <button onClick={handleLogin}>Zaloguj się</button>
            {err && <p> {err} </p>}
            <span>Nie masz konta? <Link to="/register">Zarejestruj się</Link></span>
        </form>
    </div>
    )
}

export { Login };