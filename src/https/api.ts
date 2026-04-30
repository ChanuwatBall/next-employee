import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nex-api.rubyclaw.tech/api',
});

/**
 * Fetches bus layout and seat availability for a specific trip.
 * @param tripId The unique identifier for the trip.
 * @returns An object containing tripId, layout, and seats array.
 */
export const getDriverTripPassengers = async (tripId: string) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  return await api.get(`/driver/trips/${tripId}/passengers`, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  }).then((res: any) => {
    console.log("passengers res ", res)
    return res.data
  }).catch((err) => {
    console.log("err ", err.response.data)
    return err.response.data
  })
};

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
  return response.data;
}


export const checkInSelf = async (ticketNumber: string, qrCode: string) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.post(`/checkin/self`, {
    ticketNumber,
    qrCode
  }, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  })
  return response.data;
}

export const getDriverRounds = async (limit: number = 10, offset: number = 0) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.get(`/driver/rounds?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  })
  console.log("getDriverRounds  ", response.data);
  return response.data;
}


export interface DriverLocationPayload {
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading_deg: number;
}

export const updateDriverLocation = async (payload: DriverLocationPayload) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.post(`/driver/location`, payload, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  });
  return response.data;
};


export const startShift = async <T = unknown>(
  payload: any
) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.post("/driver/shift/start", payload, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  });

  return response.data;
};

export const stopShift = async (
  payload: any
) => {
  const userstr = localStorage.getItem("session")
  const session = userstr ? JSON.parse(userstr) : null;
  const response = await api.post("/driver/shift/stop", payload, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    }
  });

  return response.data;
};


export default api;

