// widok strony z profilem uzytkownika

import "./userProfile.scss" 
import { useMutation, useQuery } from "react-query";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";


// sprawdzenie, czy w bazie users, w tabelach document_id oraz address_id 
// są jakies dane - jezeli nie, wyświetlamy w tym kontenerze tekst "Uzupełnij dane, zeby korzystac ze wszystkich funkcjonalnosci aplikacji"

const UserProfile = () => {
    const [isEditing_userInfo, setIsEditing_userInfo] = useState(false);
    const [isEditing_document, setIsEditing_document] = useState(false);
    const [isEditing_address, setIsEditing_address] = useState(false);

    const [inputsUserInfo, setInputsUserInfo] = useState({
        first_name: "",
        surname: "",
        phone_number: ""
    });

    const [inputsDocument, setInputsDocument] = useState({
        document_type: "",
        document_number: "",
        issue_date: "",
        expiry: ""
    });

    const [inputsAddress, setInputsAddress] = useState({
        street: "",
        street_number: "",
        apartament_number: "",
        city: "",
        post_code: "",
        country: ""
    });

    // ładowanie danych o uzytkowniku z bazy

    const { isLoading: isLoadingUser, error: userError, data: userData } = useQuery(['users'], () =>
        axios.get("/user/userProfile", { withCredentials: true }).then(res => res.data)
    );

    
    const { isLoading: isLoadingDocument, error: documentError, data: documentData } = useQuery(['document'], () =>
        axios.get("/user/documentInfo", { withCredentials: true }).then(res => res.data)
    );


    const { isLoading: isLoadingAddress, error: addressError, data: addressData } = useQuery(['address'], () =>
        axios.get("/user/addressInfo", { withCredentials: true }).then(res => res.data)
    );

    useEffect(() => {
        if (userData) {
            setInputsUserInfo({
                first_name: userData[0].first_name || "",
                surname: userData[0].surname || "",
                phone_number: userData[0].phone_number || ""
            });
        }
    }, [userData]);

    useEffect(() => {
        if (documentData && documentData[0]) {
            setInputsDocument({
                document_type: documentData[0].document_type || "",
                document_number: documentData[0].document_number || "",
                issue_date: documentData[0].issue_date || "",
                expiry: documentData[0].expiry || ""
            });
        } else {
            setInputsDocument({
                document_type: "", 
                document_number: "", 
                issue_date: "", 
                expiry: ""
            });
        }
    }, [documentData]);

    useEffect(() => {
        if (addressData && addressData[0]) {
            setInputsAddress({
                street: addressData[0].street || "",
                street_number: addressData[0].street_number || "",
                apartament_number: addressData[0].apartament_number || "",
                city: addressData[0].city || "",
                post_code: addressData[0].post_code || "",
                country: addressData[0].country || ""
            });
        }
    }, [addressData]);


    // ustawianie informacji z inputow

    const handleChangeUserInfo = e => {
        setInputsUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeDocument = e => {
        setInputsDocument(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeAddress = e => {
        setInputsAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const mutation_userInfo = useMutation(
        (user) => {
            return axios.put("/user/changeUserInfo", user, {
                withCredentials: true,
            });
        }
    );

    const mutation_documentChange = useMutation(
        (document) => {
            return axios.put("/user/changeDocument", document, {
                withCredentials: true,
            });
        }
    );

    const mutation_addressChange = useMutation(
        (address) => {
            return axios.put("/user/changeAddress", address, {
                withCredentials: true,
            });
        }
    );

    const mutation_documentAdd = useMutation((newDoc) => {
        return axios.post("/user/addDocument", newDoc, {
            withCredentials: true,
        });
    });

    const mutation_AddressAdd = useMutation((newAdd) => {
        return axios.post("/user/addAddress", newAdd, {
            withCredentials: true,
        });
    });

    // przyciski edytuj / zatwierdz

    const handleUserInfoClick =  async(e) => {
        e.preventDefault();
        const button_name = e.target.name;

        if(button_name === "zapisz") {
            mutation_userInfo.mutate( {...inputsUserInfo} )

        }
        setIsEditing_userInfo(!isEditing_userInfo);
    };


    const handleDocumentClick = async(e) => {
        e.preventDefault();
        const button_name = e.target.name;

        if(button_name === "zapisz") {
            if(userData[0].document_id === null) {
                mutation_documentAdd.mutate( {...inputsDocument} )
                window.location.reload();

            } else {
                mutation_addressChange.mutate( {...inputsDocument} )
                window.location.reload();
            }
        }
        setIsEditing_document(!isEditing_document);
    };

    const handleAddressClick = async(e) => {
        e.preventDefault();
        const button_name = e.target.name;

        if(button_name === "zapisz") {
            if(userData[0].address_id === null) {
                mutation_AddressAdd.mutate( {...inputsAddress} )
            } else {
                mutation_addressChange.mutate( {...inputsAddress} )
            }
        }
        setIsEditing_address(!isEditing_address);
    };

    return (
        <div className="userProfile">


        <div className="user_info">
            {isLoadingUser ? "loading" : <>
            <h2>Dane użytkownika</h2>
            {isEditing_userInfo ? (
                <div>
                    <form action="">
                    <span>Imię</span>
                    <input type="text" placeholder={userData[0].first_name} name="first_name" onChange={handleChangeUserInfo}/>
                    <span>Nazwisko</span>
                    <input type="text" placeholder={userData[0].surname} name="surname" onChange={handleChangeUserInfo}/>
                    <span>E-mail</span>
                    <input type="text" value={userData[0].email} readOnly={true} />
                    <span>Numer telefonu</span>
                    <input type="text" placeholder={userData[0].phone_number} name="phone_number" onChange={handleChangeUserInfo}/>
                    </form>
                    <button name="zapisz" onClick={handleUserInfoClick}>Zapisz</button>
                </div>

            ) : (
                <div>
                <form action="">
                <span>Imię i nazwisko:</span>
                <p>{userData[0].first_name} {userData[0].surname}</p>
                <span>Adres e-mail:</span>
                <p>{userData[0].email}</p>
                <span>Numer telefonu:</span>
                <p>{userData[0].phone_number}</p>
                </form>
                <button name="edytuj" onClick={handleUserInfoClick} style={{alignSelf: "center"}}>Edytuj</button>
                </div>
            )} 
            </>}
        </div>



    <div className="document">
    {isLoadingDocument ? "loading" : (
    <>
        <h2>Dokument</h2>

        {(userData[0].document_id === null && !isEditing_document) ? (
            <div>
                <h3>Uzupełnij informacje o dokumencie, żeby korzystać ze wszystkich funkcjonalności aplikacji.</h3>
                <button name="dodaj" onClick={handleDocumentClick} style={{alignSelf: "center"}}>Dodaj</button>
            </div>
        ) : (
            isEditing_document ? (
                <div>
                    <form>
                        <span>Rodzaj dokumentu</span>
                        <input type="text" placeholder={"Dowód osobisty"} name="document_type" onChange={handleChangeDocument} />
                        <span>Seria i numer dokumentu</span>
                        <input type="text" placeholder={"AAA111222"} name="document_number" onChange={handleChangeDocument} />
                        <span>Data wydania dokumentu:</span>
                        <input type="text" placeholder={"2016-09-08"} name="issue_date" onChange={handleChangeDocument} />
                        <span>Data ważności dokumentu:</span>
                        <input type="text" placeholder={"2026-09-08"} name="expiry" onChange={handleChangeDocument} />
                    </form>
                    <button name="zapisz" onClick={handleDocumentClick}>Zapisz</button>
                </div>
            ) : (
                documentData && documentData[0] ? (
                    <div>
                        <form>
                            <span>Typ dokumentu:</span>
                            <p>{documentData[0].document_type}</p>
                            <span>Numer dokumentu:</span>
                            <p>{documentData[0].document_number}</p>
                            <span>Data wydania dokumentu:</span>
                            <p>{documentData[0].issue_date.slice(0, 10)}</p>
                            <span>Data ważności dokumentu:</span>
                            <p>{documentData[0].expiry.slice(0, 10)}</p>
                        </form>
                        <button name="edytuj" onClick={handleDocumentClick}>Edytuj</button>
                    </div>
                ) : null
            )
        )}
    </>)}
    </div>


    <div className="address">
        {isLoadingAddress ? "loading" : (
        <>
            <h2>Adres</h2>
            {userData && userData[0] && userData[0].address_id === null && !isEditing_address ? (
                <div>
                    <h3>Uzupełnij informacje o adresie, żeby korzystać ze wszystkich funkcjonalności aplikacji.</h3>
                    <button name="dodaj" onClick={handleAddressClick} style={{alignSelf: "center"}}>Dodaj</button>
                </div>
            ) : (
                isEditing_address ? (
                    <div>
                        <form>
                            <span>Ulica</span>
                            <input type="text" placeholder={"Miodowa"} name="street" onChange={handleChangeAddress} />
                            <span>Numer domu / mieszkania</span>
                            <div className="exact_address">
                                <input type="text" placeholder={"39"} name="street_number" style={{width: "50px"}} onChange={handleChangeAddress} />
                                <p>/</p>
                                <input type="text" placeholder={"4"} name="apartament_number" style={{width: "50px"}} onChange={handleChangeAddress} />
                            </div>
                            <span>Miasto</span>
                            <input type="text" placeholder={"Gdańsk"} name="city" onChange={handleChangeAddress} />
                            <span>Kod pocztowy</span>
                            <input type="text" placeholder={"44-001"} name="post_code" onChange={handleChangeAddress} />
                            <span>Kraj</span>
                            <input type="text" placeholder={"Polska"} name="country" onChange={handleChangeAddress} />
                        </form>
                        <button name="zapisz" onClick={handleAddressClick} style={{alignSelf: "center"}}>Zapisz</button>
                    </div>
                ) : (
                    addressData && addressData[0] ? (
                        <div>
                            <form>
                                <span>Ulica:</span>
                                <p>{addressData[0].street} {addressData[0].street_number} {addressData[0].apartament_number ? `/${addressData[0].apartament_number}` : ""}</p>
                                <span>Miasto:</span>
                                <p>{addressData[0].city}</p>
                                <span>Kod pocztowy:</span>
                                <p>{addressData[0].post_code}</p>
                                <span>Kraj:</span>
                                <p>{addressData[0].country}</p>
                            </form>
                            <button name="edytuj" onClick={handleAddressClick}>Edytuj</button>
                        </div>
                    ) : null
                )
            )}
        </>)}
        </div>
    </div>


    )
}


export { UserProfile }; 

