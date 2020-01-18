import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-crud-1db4b.firebaseio.com/'
});

export default instance;
