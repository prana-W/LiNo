import {useEffect, useState} from "react";
import api from '../services/api.js'

export function useLogin(formData) {

    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function loginUser() {
            setLoading(true);
            try {

                const res = api.post('/users/login',formData);
                setResponse(res.data);

            }

            catch (error) {
                setError(error)

            }

            finally {
                setLoading(false);

            }
        }

        if (formData) loginUser();
    }, [formData]);


    return {response, loading, error};

}