import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/revenue";

export const RevenueAPI = {
  fetchRevenue: async () => {
    // For now, return mock data structure similar to the table in the UI
    // Replace with: const response = await axios.get(`${BASE_URL}/all`); return response.data;
    return [
      {
        _id: "1",
        invoiceId: "#202521021234",
        dateTime: "2025-02-24T19:30:00Z",
        items: 5,
        location: "Hyderabad",
        amount: 5400,
        invoiceUrl: "#",
        orderUrl: "#",
        storeType: "Internal Store",
      },
      {
        _id: "2",
        invoiceId: "#202521021235",
        dateTime: "2025-02-24T19:30:00Z",
        items: 11,
        location: "Hyderabad",
        amount: 5400,
        invoiceUrl: "#",
        orderUrl: "#",
        storeType: "Partner Stores",
      },
      // Add more mock rows as needed
    ];
  },
}; 