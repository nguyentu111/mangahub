import axios from "axios";
// import queryString from "query-string";
const apiDomain = process.env.NEXT_PUBLIC_API_URL;
export const axiosClient = axios.create({
  baseURL: apiDomain,
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": process.env.BASE_URL || "localhost:3000",
  },
  // paramsSerializer: (params: any) => queryString.stringify(params),
});
