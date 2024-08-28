// widok strony z wyświetlaniem pojazdów uzytkownika

import "./cars.scss"
import { useQuery } from 'react-query'
import { useState } from "react";
import axios from "axios";

const Cars = () => {

    const { isLoading, error, data } = useQuery(['cars'], () =>
        axios.get("/cars", {
            withCredentials: true,
        }).then((res) => {
            return res.data;
        })
    );

    // stan przechowujący informację, która strona jest aktualnie wyświetlana dla każdego pojazdu
    const [viewPage, setViewPage] = useState({});

    // funkcja, przełączająca widok dla danego pojazdu (pierwsza/druga strona)
    const toggleView = (carId) => {
        setViewPage(prevState => ({
            ...prevState,
            [carId]: !prevState[carId]
        }));
    };

    return (
        <div className="cars">
            {isLoading ? "loading" : data.map((car) => (
                <div className="car" key={car.id}>
                    {viewPage[car.id] ? (
                        // druga strona
                        <>
                            <h2>{car.make} {car.model}</h2>
                            <span>Typ pojazdu: </span>
                            <p>{car.vehicle_type}</p>
                            <span>Rok produkcji: </span>
                            <p>{car.production_year}</p>
                            <span>Rodzaj paliwa: </span>
                            <p>{car.fuel_type}</p>
                            <span>Styl nadwozia: </span>
                            <p>{car.body_style}</p>
                            <span>Świadectwo homologacji: </span>
                            <p>{car.first_side_homologation_doc ? "Tak" : "Nie"}</p>
                        </>
                    ) : (
                        // pierwsza strona
                        <>
                            <h2>{car.make} {car.model}</h2>
                            <span>Numer VIN: </span>
                            <p>{car.vin}</p>
                            <span>Numer Rejestracyjny: </span>
                            <p>{car.registration_number}</p>
                            <span>Data ważności badań technicznych: </span>
                            <p>{(car.technical_inspection_due_date).slice(0, 10)}</p>
                        </>
                    )}
                    <button onClick={() => toggleView(car.id)}>Druga strona</button>
                </div>
            ))}
        </div>
    );
}

export { Cars };

