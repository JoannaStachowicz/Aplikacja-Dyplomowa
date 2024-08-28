// komponent do wyświetlania tabeli aktualnościami na stronie głównej

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NewsPanel = () => {

    const location = useLocation();
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // pobieranie wiadomości z różnych endpointów
                const [formsRes, inspectionsRes ] = await Promise.all([
                    axios.get("news/newForm", { withCredentials: true }),
                    axios.get("news/techInspections", { withCredentials: true }),
                ]);

                // łączenie wszystkich wiadomości w jedną tablicę
                const allNews = [
                    ...formsRes.data,
                    ...inspectionsRes.data,
                ];

                setNews(allNews);
            } catch (err) {
                console.error("Wystąpił błąd podczas pobierania aktualności:", err);
                
            }
        };

    fetchNews();
    }, [location]);

    const value_expired = "Przegląd techniczny - nieaktualny";
    const form = "Nowy formularz";

    return (
        <div className="news_panel">
            <h2>Aktualności</h2>
            <hr/>
            <div className="news" >
            {news.map(singleNews => (
                singleNews.category === value_expired ? 
                    (<p style={{color: 'red', fontWeight: 'bold'}}>{singleNews.value}</p>) : (
                    singleNews.category === form ?
                    (<Link to={`/forms`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}> <p>{singleNews.value}</p> </Link>) :
                    (<p>{singleNews.value}</p>))
            ))}
            </div>
        </div>
    )
}

export { NewsPanel };


