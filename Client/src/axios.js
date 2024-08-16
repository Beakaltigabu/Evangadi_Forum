import axios from 'axios';

const api = axios.create({
  baseURL: 'https://evangadi-forum-backend-2s1r.onrender.com/api',
});


export default api;
