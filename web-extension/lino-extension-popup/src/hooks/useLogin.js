import {useEffect, useState} from "react";
import api from '../services/api.js'

export function useLogin(formData) {

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loginUser() {
            setLoading(true);
            setError(null);
            setResponse(null);
            try {

                const res = await api.post('/auth/login', formData);
                setResponse(res);

            } catch (error) {

                setError(error?.response?.data?.message || error?.message);

            } finally {
                setLoading(false);

            }
        }

        if (formData) loginUser();
    }, [formData]);


    return {response, loading, error};

}

export default useLogin;