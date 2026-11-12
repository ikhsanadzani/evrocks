import axios from 'axios';

export const wpApi = axios.create({
    baseURL: 'http://192.168.122.204/wp-json/wp/v2', // just example 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});