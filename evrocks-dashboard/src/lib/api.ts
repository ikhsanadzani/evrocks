import axios from 'axios';

export const wpApi = axios.create({
    baseURL: 'http://127.0.0.1/wp-json/wp/v2',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});