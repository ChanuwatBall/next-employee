import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nex-api.rubyclaw.tech/api',
});

/**
 * Fetches bus layout and seat availability for a specific trip.
 * @param tripId The unique identifier for the trip.
 * @returns An object containing tripId, layout, and seats array.
 */
export const getTripSeats = async (tripId: string) => {
  const response = await api.get(`/trips/${tripId}/seats`);
  return response.data;
};

export default api;
