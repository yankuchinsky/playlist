import axios from "axios";

export const HTTP = axios.create();

HTTP.defaults.headers.common['Authorization'] = null;