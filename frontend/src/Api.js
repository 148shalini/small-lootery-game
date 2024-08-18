import axios from 'axios';

const API_URL = 'http://localhost:5000/api/game';

export const createUser = (username, grid) => {
    return axios.post(`${API_URL}/create`, { username, grid });
};

export const generateRandomNumber = () => {
    return axios.get(`${API_URL}/random`);
};

export const cutNumber = (userId, number) => {
    return axios.post(`${API_URL}/cut`, { userId, number });
};
