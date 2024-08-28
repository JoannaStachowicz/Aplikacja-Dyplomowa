import './dropDownProfile.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DropDownProfile = () => {

    const navigate = useNavigate();


    const handleClick = async (e) => {
        e.preventDefault()
        await axios.post("/auth/logout") 
        navigate("/login")
    }
        return (
            <div className='dropDownProfile'>
                <Link to='/userProfile'>
                    <li>Mój profil</li>
                </Link>
                <p onClick={handleClick}>Wyloguj się</p>
            </div>
        )

    }

export { DropDownProfile };