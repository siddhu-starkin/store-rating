import axios from "axios";

const BASE_URL = "https://store-rating-f515.onrender.com/api/staff";

export const StaffAPI = {
  fetchAllStaff: async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  },
};
