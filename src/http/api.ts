import axios from "axios";

export const API = "https://nex-api.rubyclaw.tech/api";

export const apiClient = axios.create({
	baseURL: API,
	headers: {
		"Content-Type": "application/json",
	},
});

export interface DriverLoginPayload {
	phone: string;
	licenseNumber: string;
}

export interface DriverCheckInPayload {
	ticketNumber: string;
	qrCode: string;
}

const getAuthorizationHeader = (token: string) => ({
	Authorization: `Bearer ${token}`,
});

export const driverLogin = async <T = unknown>(payload: DriverLoginPayload): Promise<T> => {
	const response = await apiClient.post<T>("/driver/login", payload);
	return response.data;
};

export const getDriverTrips = async <T = unknown>(date: string, token: string): Promise<T> => {
	const response = await apiClient.get<T>("/driver/trips", {
		params: { date },
		headers: getAuthorizationHeader(token),
	});

	return response.data;
};

export const driverCheckIn = async <T = unknown>(
	payload: DriverCheckInPayload,
	token: string,
): Promise<T> => {
	const response = await apiClient.post<T>("/driver/checkin", payload, {
		headers: getAuthorizationHeader(token),
	});

	return response.data;
};

export const getDriverTripPassengers = async <T = unknown>(
	tripId: string,
	token: string,
): Promise<T> => {
	const response = await apiClient.get<T>(`/driver/trips/${tripId}/passengers`, {
		headers: getAuthorizationHeader(token),
	});

	return response.data;
};

export const getBookingDetail = async <T = unknown>(id: string, token: string): Promise<T> => {
	const response = await apiClient.get<T>(`/bookings/${id}`, {
		headers: getAuthorizationHeader(token),
	});

	return response.data;
};