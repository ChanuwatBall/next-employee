export interface BusStop {
  id: string;
  route_id: string;
  name: string;
  type: string;
  order: number;
  created_at: string;
}

export interface BusType {
  id: string;
  name: string;
  seats: number;
  amenities: string[];
  price_modifier: number;
  description: string;
  created_at: string;
}

export interface Trip {
  id: string;
  bus_type_id: string;
  departure_time: string;
  arrival_time: string;
  date: string;
  price: number;
  available_seats: number;
  status: string;
  bus_number: string;
  driver_name: string | null;
  profile_id: string | null;
  created_at: string;
  origin_province_id: string;
  destination_province_id: string;
  total_seats: number;
  trip_type: string;
  bus_stops?: BusStop[];
  bus_type?: BusType;
  route_id?: {
    id: string,
    origin: string,
    distance: number,
    duration: string,
    origin_id: string,
    region_id: string,
    base_price: number,
    created_at: string,
    destination: string
    destination_id: string
  }
}
