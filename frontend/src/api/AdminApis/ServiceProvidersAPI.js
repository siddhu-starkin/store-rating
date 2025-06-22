import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://store-rating-f515.onrender.com/api/users";

export const ServiceProvidersAPI = {
  fetchServiceProviders: async () => {
    const response = await axios.get(`${BASE_URL}/service-providers`);
    return response.data;
  },
};
