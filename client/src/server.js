import axios from "axios";

const server = axios.create({
  baseURL:'https://ipfs-server.onrender.com'
});

export default server;
