import APIInstance from "@mirlo/mirlo-api-client";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
const api = APIInstance(API_HOST, ""); // no key needed for same site

export default api;
