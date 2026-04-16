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

export const getBookingDetail = async (id: string) => {
  // curl '/api/bookings/{id}' \
  // --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.get(`/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  })
  return response;
}
export default api;

