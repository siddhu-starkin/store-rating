import axios from "axios";

const BASE_URL = "http://localhost:8000/api/staff";

export const StaffAPI = {
  fetchAllStaff: async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  },
};
