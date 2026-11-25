export type TravelClassCode = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S';

export type BookingQuotaCode = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS';

export type BerthType = 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'MS' | 'AS';

export type BerthPreference = 'NO_PREF' | 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW';

export type TrainCategory =
  | 'Vande Bharat'
  | 'Rajdhani'
  | 'Shatabdi'
  | 'Duronto'
  | 'Superfast'
  | 'Mail/Express';

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  platforms: number;
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  city: string;
  arrival: string; // HH:mm or "Origin"
  departure: string; // HH:mm or "Destination"
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: string;
  lat: number;
  lng: number;
}

export interface ClassAvailability {
  classCode: TravelClassCode;
  className: string;
  fare: number;
  status: 'AVAILABLE' | 'RAC' | 'WL' | 'NOT_AVAILABLE';
  count: number; // seats available or RAC/WL number
  statusText: string; // e.g. "AVL 42", "RAC 8", "WL 14"
  coachPrefix: string;
}

export interface Train {
  number: string;
  name: string;
  category: TrainCategory;
  fromCode: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationLabel: string;
  distanceKm: number;
  runningDays: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  classes: ClassAvailability[];
  applicableQuotas: BookingQuotaCode[];
  stops: TrainStop[];
  pantry: boolean;
  avgSpeedKmph: number;
  hasBioVacuum: boolean;
}

export interface CoachBerth {
  id: string;
  number: number;
  berthType: BerthType;
  bay: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'PREFERRED' | 'RAC';
  accessible?: boolean;
  side?: boolean;
}

export interface PassengerInput {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  berthPreference: BerthPreference;
  concession: 'NONE' | 'SENIOR_CITIZEN' | 'STUDENT' | 'DIVYANGJAN';
  demoSelectedSeat?: string;
}

export interface BookingRecord {
  id: string;
  pnr: string;
  bookingReference: string;
  userId: string;
  trainNumber: string;
  trainName: string;
  category: TrainCategory;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  durationLabel: string;
  classCode: TravelClassCode;
  className: string;
  quota: BookingQuotaCode;
  passengers: (PassengerInput & {
    bookingStatus: string;
    assignedCoach?: string;
    assignedBerth?: string;
  })[];
  contactEmail: string;
  contactPhone: string;
  baseFare: number;
  taxes: number;
  convenienceFee: number;
  totalAmount: number;
  paymentId: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLIST' | 'CANCELLED' | 'PAYMENT_FAILED';
  chartPrepared: boolean;
  isDemo: true;
  createdAt: string;
  updatedAt: string;
}

export interface CancellationRequest {
  id: string;
  bookingId: string;
  pnr: string;
  userId: string;
  reason: string;
  refundAmount: number;
  status: 'REQUESTED' | 'PROCESSED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'user' | 'admin';
  provider: 'credentials' | 'google-demo' | 'otp-demo';
  savedPassengers: PassengerInput[];
  favouriteRoutes: { fromCode: string; toCode: string }[];
  favouriteDestinations: string[];
  recentSearches: { fromCode: string; toCode: string; date: string; classCode?: TravelClassCode }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Destination {
  slug: string;
  city: string;
  state: string;
  stationCode: string;
  tagline: string;
  editorialDescription: string;
  bestTime: string;
  signatureTrain: string;
  imageUrl: string;
  imageCredit: string;
  highlights: string[];
  fromHubs: { fromCode: string; duration: string; startingFare: number }[];
}
