import Conversation from "../models/conversation.model.js";

/**
 * Generates a unique ticket ID in the format TKT-YYYYMMDD-XXXXX
 * where XXXXX is a random 5-digit number
 */
export const generateTicketId = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Generate a random 5-digit number
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  const ticketId = `TKT-${year}${month}${day}-${randomNum}`;

  // Check if ticket ID already exists
  const existingTicket = await Conversation.findOne({ ticketId });

  if (existingTicket) {
    // If ticket ID exists, recursively generate a new one
    return generateTicketId();
  }

  return ticketId;
};
