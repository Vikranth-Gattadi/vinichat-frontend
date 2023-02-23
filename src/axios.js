import axios from "axios";

const instance = axios.create({
    baseURL: "https://vinichat-api.onrender.com"
})

export default instance;