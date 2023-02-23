import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5329"
})

export default instance;