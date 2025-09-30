import {useEffect, useState} from "react";
import api from '../services/api.js'

export function useSignup(formData) {

    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function signupUser() {
            setLoading(true);
            try {

                const res = api.post('/users/signup',formData);
                setResponse(res.data);

            }

            catch (error) {
                setError(error)

            }

            finally {
                setLoading(false);

            }
        }

        if (formData) signupUser();
    }, [formData]);


    return {response, loading, error};

}