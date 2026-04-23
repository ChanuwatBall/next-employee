import axios from "axios";

export const API = "https://nex-api.rubyclaw.tech/api";

export const apiClient = axios.create({
	baseURL: API,
	headers: {
		"Content-Type": "application/json",
	},
});

export interface DriverLoginPayload {
	username: string;
	password: string;
}

export interface DriverLoginResponse {
	token: string;
	access_token: string;
	refresh_token: string;
	user: {
		id: string;
		username: string;
		fullName: string;
		phone: string;
		email: string;
		avatarUrl: string;
	};
	driver: {
		id: string;
		name: string;
		phone: string;
		licenseNumber: string;
	};
}

export interface DriverCheckInPayload {
	ticketNumber: string;
	qrCode: string;
}

const getAuthorizationHeader = (token: string) => ({
	Authorization: `Bearer ${token}`,
});

export const driverLogin = async (
	payload: DriverLoginPayload,
): Promise<DriverLoginResponse> => {
	const response = await apiClient.post<DriverLoginResponse>("/driver/login", payload);
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

export interface DriverMeResponse {
	driver: {
		id: string;
		name: string;
		license_number: string;
		phone: string;
		is_active: boolean;
		earning_per_round: number;
		notes: string | null;
		updated_at: string;
	};
	user: {
		id: string;
		username: string;
		email: string | null;
		full_name: string;
		phone: string;
		avatar_url: string | null;
	};
	today_rounds_count: number;
	today_earnings: number;
	today_window_start: string;
	today_window_end: string;
	current_shift: unknown | null;
	alerts: unknown[];
}

export const getDriverMe = async (token: string): Promise<DriverMeResponse> => {
	const response = await apiClient.get<DriverMeResponse>("/driver/me", {
		headers: getAuthorizationHeader(token),
	});
	return response.data;
};

export interface UpdateDriverMePayload {
	name?: string;
	phone?: string;
	current_password?: string;
	new_password?: string;
}

export const updateDriverMe = async (
	payload: UpdateDriverMePayload,
	token: string,
): Promise<DriverMeResponse> => {
	const response = await apiClient.patch<DriverMeResponse>("/driver/me", payload, {
		headers: getAuthorizationHeader(token),
	});
	return response.data;
};