import axios from "axios";

const instance = axios.create({
    baseURL: "https://vinichat-api.onrender.com/"
    // baseURL:"https://localhost:5329"
})

export default instance;