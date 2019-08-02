import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://test-aruba-fe3a6.firebaseio.com/'
});

export default instance;
