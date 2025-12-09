import {useEffect, useState} from "react";
import api from '../services/api.js'

export function useCheckHealth(formData) {

    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function checkHealth() {
            setLoading(true);
            try {

                const res = api.post('/check-health',formData);
                setResponse(res.data);

            }

            catch (error) {
                setError(error)

            }

            finally {
                setLoading(false);

            }
        }

        if (formData) checkHealth();
    }, [formData]);


    return {response, loading, error};

}