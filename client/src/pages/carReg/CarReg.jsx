// widok strony do rejestrowania pojazdów 

import { useState } from "react";
import "./carReg.scss"
import Select from 'react-select';
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { selectOptions_type, selectOptions, selectStyles, selectOption_body } from "./select_opts";
import { upload } from "../../upload";
import { useNavigate } from "react-router-dom";


const CarReg = () => {

    const [innerSide, setInnerSide] = useState(null);
    const [outerSide, setOuterSide] = useState(null);

    const [err, setError] = useState(false);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({

        vehicle_type: "",
        body_style: "",
        vin: "",
        make: "",
        model: "",
        registration_number: "",
        production_year: "",
        fuel_type: "",
    });

    const queryClient = useQueryClient()

    const mutation = useMutation((newCar) => {
        return axios.post("/carReg", newCar, {
            withCredentials: true,
        });
    }, 
    {
        onSuccess: () => {
            navigate("/cars")
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
            [name]: option ? option.value : ""
        }));
    };

    const handleClick = async e => {
        e.preventDefault();

        let imgUrl1 = "";
        let imgUrl2 = "";

        if (innerSide) imgUrl1 = await upload(innerSide);
        if (outerSide) imgUrl2 = await upload(outerSide);

        const carData = {
            ...inputs, 
            first_side_homologation_doc: imgUrl1,
            second_side_homologation_doc: imgUrl2,
        };
        
        mutation.mutate(carData);

    }; 

    return (
    <div className="carReg">
        <h1>Rejestracja pojazdu</h1>
        <div className="card">
            <div className="left">
                <form>
                    <h3>Dane pojazdu:</h3>
                    <span>Rodzaj pojazdu</span>
                    <Select className="select"
                        name="vehicle_type"
                        options={selectOptions_type}
                        styles={selectStyles}
                        isSearchable 
                        placeholder="Wybierz typ pojazdu"
                        onChange={handleChangeSelect}
                    />
                    <span>Numer VIN</span>
                    <input type="text" placeholder="5TFAW5F12H597834" name="vin" onChange={handleChange}/>
                    <span>Marka</span>
                    
                    <Select className="select"
                        name="make"
                        options={selectOptions}
                        styles={selectStyles}
                        isSearchable 
                        placeholder="Wybierz markę pojazdu"
                        onChange={handleChangeSelect}/>

                    {/*<input type="text" placeholder="Toyota" />*/}
                    <span>Model</span>
                    <input type="text" placeholder="Camry" name="model" onChange={handleChange}/>
                    <span>Typ pojazdu</span>
                    <Select className="select"
                        name="body_style"
                        options={selectOption_body}
                        styles={selectStyles}
                        isSearchable 
                        placeholder="Wybierz rodzaj nadwozia"
                        onChange={handleChangeSelect}/>
                    
                    <span>Numer rejestracyjny</span>
                    <input type="text" placeholder="SBXXXXX" name="registration_number" onChange={handleChange}/>
                    <span>Rok produkcji</span>
                    <input type="text" placeholder="2008" name="production_year" onChange={handleChange}/>
                    <span>Rodzaj paliwa</span>
                    <input type="text" placeholder="Benzyna" name="fuel_type"
                    onChange={handleChange}/>
                </form>
            </div>
            <div className="right">
                <form>
                    <h3>Świadectwo homologacji:</h3>
                    <p>Może być to dowolny dokument wyszczególniony w art. 72, punkcie 1, podpunkcie 3 prawa o ruchu drogowym</p>
                    <span>Zdjęcie/skan pierwszej strony świadectwa homologacji:</span>
                    <input type="file" name="innerSide" id="" style={{border:"none"}} onChange={e=>setInnerSide(e.target.files[0])}/>
                    <span>Zdjęcie/skan drugiej strony (opcjonalnie) świadectwa homologacji:</span>
                    <input type="file" name="outerSide" id="" style={{border:"none"}} onChange={e=>setOuterSide(e.target.files[0])}/>
                    <button onClick={handleClick}>Zarejestruj pojazd</button>
                    {err && <p style={{fontSize: "16px", color: "red"}}> {err} </p>}
                </form>
            </div>
        </div>
    </div>
    )
}

export { CarReg };

