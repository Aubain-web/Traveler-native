import { useState, useCallback } from 'react';
import { useAuth } from '../Components/authContext';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Utilisez la fonction de login du contexte

  const fetchData = useCallback(async (url, method, body = null, auth = false) => {
    setIsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (auth && body && body.token) {
        headers['Authorization'] = `Bearer ${body.token}`;
        delete body.token;
      }

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (url.includes('login') && result.token) {
        login(result);
      }

      setData(result);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }, [login]);

  return { data, isLoading, error, fetchData };
};

export default useFetch;
