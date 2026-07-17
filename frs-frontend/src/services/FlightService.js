import axios from "axios";

const API = "http://localhost:8080/api/flights";

export const getFlights = () => {
  return axios.get(API);
};

export default {
  getFlights,
};