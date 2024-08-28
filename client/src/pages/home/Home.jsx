// plik z widokiem strony głównej aplikacji

import "./home.scss";
import { Link } from "react-router-dom";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import { NewsPanel } from "./NewsPanel";


const Home = () => {

    return (
    <div className="home">
        <div className="container">
            <Link to='/carReg'>
                <div className="item">
                    <AssignmentOutlinedIcon fontSize="large"/>
                    <span>Rejestracja pojazdu</span>
                </div>
            </Link>
            <Link to='/changeOwner'>
                <div className="item">
                    <HandshakeOutlinedIcon fontSize="large"/>
                    <span>Zmiana właściciela</span>
                </div>
            </Link>
            <Link to='/forms'>
                <div className="item">
                    <Inventory2OutlinedIcon fontSize="large"/>
                    <span>Moje formularze</span>
                </div>
            </Link>
            <Link to='/cars'>
                <div className="item">
                    <EmojiTransportationOutlinedIcon fontSize="large"/>
                    <span>Moje pojazdy</span>
                </div>
            </Link>
        </div>
        <NewsPanel/>
    </div>
    )
}

export { Home };