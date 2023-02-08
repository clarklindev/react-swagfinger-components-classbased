import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-crud-d662d-default-rtdb.firebaseio.com/',
});

export default instance;
