import "./navbar.scss";
import { Link } from "react-router-dom";
import CarRentalRoundedIcon from '@mui/icons-material/CarRentalRounded'; // niech to będzie logo aplikacji
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { DropDownProfile } from './DropDownProfile';
import { useState } from "react";

const Navbar = () => {

    const { currentUser } = useContext(AuthContext);

    const [dropDown, setDropDown] = useState(false);

    const handleClick = () => {
        setDropDown(!dropDown);
    };


    return (
        <div className='navbar'>
            <div className='left'>
                <Link to="/"><CarRentalRoundedIcon fontSize="large"/></Link>
                <Link to="/"><span>Car Manager</span></Link>
            </div>
            <div className='right'>
                <Link to="/userProfile" style={{decoration: "none", color: "inherit"}}>
                    <AccountCircleRoundedIcon/>
                </Link>
                <span>
                    <p onClick={handleClick}>{currentUser.first_name} {currentUser.surname}</p>
                    {dropDown && <DropDownProfile/>}
                </span>
            </div>

        </div>
    )
}

export { Navbar };

