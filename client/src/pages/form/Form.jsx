// strona do wyświetlania szczegółów pojedynczego formularza - 
// w przypadku, gdy status formularza = 'oczekuje' oraz nabywca = current_user (zalogowany uzytkownik)
// wyswietlamy przyciski do akceptacji lub odrzucenia formularza

import './form.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import { AuthContext } from '../../context/authContext';
import { useContext, useState } from 'react';

const Form = () => {

    const location = useLocation();
    const { currentUser } = useContext(AuthContext);
    const [visible_buttons, setVisible_buttons] = useState(false);  
    const [err, setError] = useState(false);
    const forms_id = location.pathname.split("/")[2]

    const { isLoading, error, data } = useQuery(['form'], () =>
        axios.get(`/form/${forms_id}`, {
            withCredentials: true,
        }).then((res) => res.data),
        {
            onSuccess: (data) => {
                if(data && data.length > 0) {
                    setVisible_buttons(data[0].status === 'oczekuje' && currentUser.id === data[0].new_owner_id)
                    return data;
                }
            }
        }
    );

    const mutation = useMutation((newData) => {
        return axios.post("/finishChangeOwn", newData, {
            withCredentials: true,
        });
    });

    // warunek do wyswietlania przyciskow: status == oczekuje, nabywca == current_user

    const handleClickConfirm = e => {
        e.preventDefault()
        if (isLoading) {
            console.log("loading"); // jeśli dane są wciąż ładowane lub są niedostępne, nie wykonuj mutacji
        }
        else {
            if (data && data.length > 0) {
                const newData = {
                    form_id: data[0].form_id, // używamy form_id z danych
                    action: 'potwierdz',
                };
            try {
                mutation.mutate(newData);
                window.location.reload();
    
            } catch (err) {
                setError(err.response.data.message);
            }}
        }
    };

    const handleClickReject = e => {
        console.log(isLoading);
        e.preventDefault()
        if (isLoading) {
            console.log("LOADING"); // jeśli dane są wciąż ładowane lub są niedostępne, nie wykonuj mutacji
        }
        else {
            if (data && data.length > 0) {
                const newData = {
                    form_id: data[0].form_id, // używamy form_id z danych
                    action: 'odrzuc',
                };
            try {
                mutation.mutate(newData);
                window.location.reload();
    
            } catch (err) {
                setError(err.response.data.message);
            }
        }}
    };
    
    if (isLoading) {
        return <p> LOADING </p>
    }

    return (
        <div className='form'>
            <div className='container'>
                <h2>Data: {data[0].form_date.slice(0, 10)}</h2>
                <span>Sprzedawca: </span>
                <p>{data[0].ex_owner_first_name} {data[0].ex_owner_surname}</p>
                <span>Nabywca: </span>
                <p>{data[0].new_owner_first_name} {data[0].new_owner_surname}</p>
                <span>Pojazd:</span>
                <p>{data[0].make} {data[0].model} {data[0].registration_number}</p>
                <span>Status transakcji: </span>
                <p>{data[0].status}</p>
            </div>
            {visible_buttons && (
            <div className='buttons'>
                <button onClick={handleClickConfirm} name='potwierdz' style={{backgroundColor: 'lightgreen'}}>POTWIERDŹ</button>
                <button onClick={handleClickReject} name='odrzuc' style={{backgroundColor: 'tomato'} }>ODRZUĆ</button>
            </div>  
            )}
        </div>
    )
}

export { Form };