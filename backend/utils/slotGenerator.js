import Availability from '../models/availability.model.js';
import Leave from '../models/leave.model.js';
import Slot from '../models/slot.model.js';
import mongoose from 'mongoose';

/**
 * Helper to generate time slots between start and end times
 * @param {string} start - Start time in HH:mm format
 * @param {string} end - End time in HH:mm format
 * @param {number} intervalMinutes - Interval between slots in minutes
 * @returns {Array<{startTime: string, endTime: string}>} Array of time slots
 */
function generateTimeSlots(start, end, intervalMinutes = 30) {
  try {
    if (!start || !end) {
      throw new Error('Start and end times are required');
    }

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) {
      throw new Error('Invalid time format');
    }

    const slots = [];
    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    while (current < endTime) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + intervalMinutes);
      const slotEnd = current.toTimeString().slice(0, 5);
      slots.push({ startTime: slotStart, endTime: slotEnd });
    }

    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    throw error;
  }
}

/**
 * Generate slots for a user based on their availability and leaves
 * @param {string} userId - User ID
 * @param {string} userType - Type of user (e.g., 'Store', 'Pandit')
 * @param {Date|string} fromDate - Start date
 * @param {Date|string} toDate - End date
 * @returns {Promise<void>}
 */
export async function generateSlotsForUser(userId, userType, fromDate, toDate) {
  try {
    // Input validation
    if (!userId || !userType || !fromDate || !toDate) {
      throw new Error('Missing required parameters');
    }

    const validUserTypes = ['Pujari', 'Bhajantri'];
    if (!validUserTypes.includes(userType)) {
      throw new Error('Invalid user type');
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    if (end < start) {
      throw new Error('End date must be after start date');
    }

    // Fetch availability and leaves
    const [availability, leaveDocs] = await Promise.all([
      Availability.find({ user: userId, userType }),
      Leave.find({ user: userId, userType })
    ]);

    const leaveDates = leaveDocs.flatMap((l) => l.dates || [l.date]).map(d => d.toDateString());

    // Generate slots for each day
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const todayStr = d.toDateString();

      if (leaveDates.includes(todayStr)) continue; // skip leave

      const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek && a.isAvailable);
      if (!dayAvailability) continue;

      // Prepare bulk operations for slots
      const slotOperations = [];
      for (const timeSlot of dayAvailability.timeSlots) {
        const generatedSlots = generateTimeSlots(timeSlot.startTime, timeSlot.endTime);
        for (const slot of generatedSlots) {
          slotOperations.push({
            updateOne: {
              filter: {
                user: userId,
                userType,
                date: new Date(todayStr),
                startTime: slot.startTime,
                endTime: slot.endTime,
              },
              update: {
                $setOnInsert: {
                  isBooked: false,
                }
              },
              upsert: true
            }
          });
        }
      }

      // Execute bulk operations if any
      if (slotOperations.length > 0) {
        await Slot.bulkWrite(slotOperations);
      }
    }
  } catch (error) {
    console.error('Error in generateSlotsForUser:', error);
    throw error;
  }
} 