import axios from "axios";

const instance = axios.create({
    baseURL: ["http://localhost:5329", "https://vinichat-api.onrender.com"]
})

export default instance;