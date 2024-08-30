// strona z widokiem zmiany właściciela pojazdu

import "./changeOwner.scss"
import Select from 'react-select';
import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { selectStyles } from "../carReg/select_opts"
import { upload } from "../../upload";
import { useNavigate } from "react-router-dom";

// teoretycznie sam pesel by wystarczył do wprowadzenia danych nowego wlasciciela, 
// ale prewencyjnie wymagane jest takze podanie imienia i nazwiska
// jako formę walidacji danych tj. odrzuca to przypadki, w ktorych wypelniajacy pomylilby sie w peselu, 
// a pomylkowy pesel takze bylby w bazie danych i dopasowalby sie przypadkowo do innego uzytkownika

const ChangeOwner = () => {

    const [firstSide, setFirsSide] = useState(null);
    const [secondSide, setSecondSide] = useState(null);

    const [err, setError] = useState(false);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        pesel: "",
        first_name: "",
        surname: "", 
        vehicle_id: "",

    });

    // pobieranie pojazdów do wyswietlenia

    const { isLoading, error, data } = useQuery(['cars'], () =>
        axios.get("/cars", {
            withCredentials: true,
        }).then((res) => {
            return res.data;
        })
    );

    // uzytkownik wybiera pojazd, który chce przerejestrowac

    const selectOptions = !isLoading ? data.map((car) => ({
        value: `${car.id}`,
        label: `${car.make} ${car.model} ${car.registration_number}`
    })) : [];

    const mutation = useMutation((newData) => {
        return axios.post("/changeOwner", newData, {
            withCredentials: true,
        });
    }, 
    {
        onSuccess: () => {
            navigate("/forms")
        },
        onError: (err) => {
            setError(err.response.data);
        }
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeSelect = (option, { name }) => {
        setInputs(prev => ({
            ...prev,
            [name]: option ? parseInt(option.value, 10) : null
        }));
    };
    
    const handleClick = async e => {
        e.preventDefault();
        try {
            let imgUrl1 = "";
            let imgUrl2 = "";
    
            if (firstSide) imgUrl1 = await upload(firstSide);
            if (secondSide) imgUrl2 = await upload(secondSide);
    
            const newData = {
                ...inputs, 
                first_side_sale_agreement: imgUrl1,
                second_side_sale_agreement: imgUrl2,
            };
            
            mutation.mutate(newData);
        } catch (err) {
            setError(err.response.data);
        }
    }; 

    console.log(err)

    return (
    <div className="changeOwner">
        <h1>Przerejestruj pojazd</h1>
        <div className="card">
            <div className="left">
                <form action="">
                    <h2>Dane nabywcy</h2>
                    <span>Pesel</span>
                    <input type="text" placeholder="11122233344" name="pesel" onChange={handleChange}/>
                    <span>Imię</span>
                    <input type="text" placeholder="Jan" name="first_name" onChange={handleChange}/>
                    <span>Nazwisko</span>
                    <input type="text" placeholder="Kowalski" name="surname" onChange={handleChange}/>
                    {err && <p style={{fontSize: "16px", color: "red"}}> {err} </p>}
                </form>
            </div>

            <div className="right">
                    <form action="">
                        <h2>Szczegóły transakcji</h2>   
                        <span>Pojazd</span>       
                        <Select className="select"
                            name="vehicle_id"
                            options={selectOptions}
                            styles={selectStyles}
                            isSearchable 
                            placeholder="Wybierz pojazd do przerejestrowania"
                            onChange={handleChangeSelect}
                        />
                        <span>Zdjęcie/skan umowy sprzedaży przód</span>
                        <input type="file" name="firstSide" onChange={e=>setFirsSide(e.target.files[0])}/>
                        <span>Zdjęcie/skan umowy sprzedaży tył (opcjonalnie)</span>
                        <input type="file" name="secondSide" onChange={e=>setSecondSide(e.target.files[0])}/>
                    </form>      

                    <button onClick={handleClick}>Zatwierdź</button>
            </div>
        </div>
    </div>
    )
}

export { ChangeOwner };
