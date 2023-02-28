import axios from "axios";

const instance = axios.create({
    // baseURL: "https://vinichat-api.onrender.com/"
    baseURL: "http://localhost:5329"
})

export default instance;