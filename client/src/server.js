import axios from "axios";

const server = axios.create({
  baseURL:'https://malaika-backend-server.onrender.com/'

});

export default server;
