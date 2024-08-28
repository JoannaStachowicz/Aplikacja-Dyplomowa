// widok strony, wyświetlającej formularze uytkownika
// (czyli takich, w których uytkownik jest stroną kupującą lub sprzedającą)

import "./forms.scss";
import { useState } from "react";
import { PageController } from "./PageController";
import { useQuery } from 'react-query';
import axios from "axios";
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";


const Forms = () => {

    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(['forms'], () =>
        axios.get("/forms", {
            withCredentials: true,
        }).then((res) => {
            return res.data;
        })
    );

    // chcemy na kazdej stronie formularza wyswietlac maksymalnie 6 itemow
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const start_id = (currentPage - 1) * itemsPerPage;
    const end_id = start_id + itemsPerPage;

    if (isLoading) {
        return <p> LOADING </p>
    }

    const currentItems = data.slice(start_id, end_id);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    
    const filledItems = [
        ...currentItems,
        ...Array(itemsPerPage - currentItems.length).fill({ empty: true }),
    ];

    // podswietlanie itemow, które oczekują na akceptacje przez zalogowanego uzytkownika
    const itemStyle = (status, id) => {
        if(status === 'oczekuje' && id === currentUser.id) {
            return '2px solid orange';
        }
    }

    return (
    <div className="forms">
        <div className="container">
            <div className="items">
                {filledItems.map(item => (
                    item.form_id ? (
                        <Link to={`/form/${item.form_id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', border: itemStyle(item.status, item.new_owner_id) }} className="item" key={item.id}>
                            <h2>{item.form_date.slice(0, 10)}</h2>
                            <span>Sprzedawca: </span>
                            <p>{item.ex_owner_first_name} {item.ex_owner_surname}</p>
                            <span>Nabywca: </span>
                            <p>{item.new_owner_first_name} {item.new_owner_surname}</p>
                            <span>Status: </span>
                            <p>{item.status}</p>
                        </Link>
                    ) : (
                        <div className="item_empty"></div>
                    )
                ))}
            </div>
            <PageController
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
            />
        </div>
    </div>
    )
}
export { Forms };