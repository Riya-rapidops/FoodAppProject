import axios from "axios";
import { decrypt, encrypt } from "./functions";

const api = axios.create({
  baseURL: 'http://localhost:5000/' 
});

api.interceptors.request.use(async function (config) {
  
  // Do something before request is sent
  // const data = await encrypt(config.data)
  const data =config.data;
  config.data = { data } 
  return config;
}, function (error) {
  
  // Do something with request error
  return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
  
  // Do something with response data
  // const decryptedData = decrypt(response.data)
  const decryptedData = response.data
  response.data = decryptedData 
  return response;
}, function (error) {
  
  // Do something with response error
  return Promise.reject(error);
});

export default api;

