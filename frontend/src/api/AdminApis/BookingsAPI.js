import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/bookings";

export const BookingsAPI = {
  fetchBookings: async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data; // Ensure you return the actual data
  },
  fetchByBookingId: async (bookingId) => {
    const response = await axios.get(`${BASE_URL}/${bookingId}`);
    return response.data;
  },
};
