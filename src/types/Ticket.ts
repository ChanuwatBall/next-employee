export interface Passenger {
  fullName: string;
  thaiId: string;
  phone: string;
  seatNumber: string;
  passengerType: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  booking_id: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_id_card: string;
  seat_number: string;
  price: number;
  passenger_type: string;
  status: string;
  checked_in_at: string | null;
  created_at: string;
  qr_code: string | any;
}

export interface BookingResponse {
  id: string;
  bookingReference: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  status: string;
  paymentStatus: string;
  expiresAt: string | null;
  omiseChargeId: string;
  total: number;
  boardingPoint: string;
  dropOffPoint: string;
  busType: string;
  tripType: string;
  busPlate: string;
  routeName: string;
  paymentMethod: string;
  promoCode: string;
  discount: number;
  pricePerSeat: number;
  bookingDate: string;
  passengers: Passenger[];
  tickets: Ticket[];
}
