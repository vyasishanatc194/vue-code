import axios from 'axios';
import baseurl from './baseurl';

const entryPoint = baseurl.calculateBaseUrl() + '/app-api/v2/';

const Service = axios.create({
  baseURL: entryPoint,
  withCredentials: true,
});

// A middleware is needed, probably here to see if the token is valid and to update it if not

Service.interceptors.request.use(config => {
  if (localStorage.getItem('app-token')) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('app-token');
  }
  return config;
});
export default Service;
