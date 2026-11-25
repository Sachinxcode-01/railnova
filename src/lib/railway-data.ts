import {
  BookingQuotaCode,
  CoachBerth,
  Destination,
  Station,
  Train,
  TrainStop,
  TravelClassCode,
} from './types';

export const TRAVEL_CLASS_LABELS: Record<TravelClassCode, string> = {
  '1A': 'First AC (1A)',
  '2A': 'Second AC (2A)',
  '3A': 'Third AC (3A)',
  '3E': 'AC 3 Economy (3E)',
  SL: 'Sleeper (SL)',
  CC: 'AC Chair Car (CC)',
  EC: 'Executive Chair Car (EC)',
  '2S': 'Second Sitting (2S)',
};

export const QUOTA_LABELS: Record<BookingQuotaCode, { name: string; description: string }> = {
  GN: { name: 'General (GN)', description: 'Standard railway booking quota' },
  TQ: { name: 'Tatkal (TQ)', description: 'Last-minute booking opens 1 day prior' },
  PT: { name: 'Premium Tatkal (PT)', description: 'Dynamic fare last-minute quota' },
  LD: { name: 'Ladies (LD)', description: 'Reserved for female passengers & children' },
  SS: { name: 'Senior Citizen / Lower Berth', description: 'Priority lower berth quota' },
};

export const STATIONS: Station[] = [
  // South & Karnataka / Kerala / TN / AP / Telangana
  { code: 'SBC', name: 'KSR Bengaluru City Jn', city: 'Bengaluru', state: 'Karnataka', lat: 12.9781, lng: 77.5697, platforms: 10 },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka', lat: 13.0238, lng: 77.5504, platforms: 6 },
  { code: 'SMVB', name: 'SMVT Bengaluru', city: 'Bengaluru', state: 'Karnataka', lat: 13.0012, lng: 77.6382, platforms: 7 },
  { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', lat: 12.3156, lng: 76.6454, platforms: 6 },
  { code: 'UBL', name: 'SSS Hubballi Junction', city: 'Hubballi', state: 'Karnataka', lat: 15.3458, lng: 75.1462, platforms: 8 },
  { code: 'MAQ', name: 'Mangaluru Central', city: 'Mangaluru', state: 'Karnataka', lat: 12.8634, lng: 74.8428, platforms: 4 },
  { code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa', lat: 15.2683, lng: 73.9693, platforms: 3 },
  { code: 'MAS', name: 'Puratchi Thalaivar Dr. MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.275, platforms: 12 },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0732, lng: 80.2609, platforms: 11 },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', lat: 10.9965, lng: 76.9667, platforms: 6 },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9195, lng: 78.1103, platforms: 6 },
  { code: 'MTP', name: 'Mettupalayam', city: 'Mettupalayam', state: 'Tamil Nadu', lat: 11.2998, lng: 76.9355, platforms: 2 },
  { code: 'UAM', name: 'Udagamandalam (Ooty)', city: 'Ooty', state: 'Tamil Nadu', lat: 11.4064, lng: 76.6932, platforms: 2 },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4875, lng: 76.9525, platforms: 5 },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', lat: 9.9691, lng: 76.2913, platforms: 6 },
  { code: 'CLT', name: 'Kozhikode Main', city: 'Kozhikode', state: 'Kerala', lat: 11.2471, lng: 75.7815, platforms: 4 },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', lat: 17.4344, lng: 78.5013, platforms: 10 },
  { code: 'HYB', name: 'Hyderabad Deccan (Nampally)', city: 'Hyderabad', state: 'Telangana', lat: 17.3921, lng: 78.4673, platforms: 6 },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5186, lng: 80.6199, platforms: 10 },
  { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7219, lng: 83.2896, platforms: 8 },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, platforms: 6 },

  // West & Central India
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', lat: 18.9398, lng: 72.8355, platforms: 18 },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193, platforms: 5 },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', lat: 19.0699, lng: 72.8916, platforms: 5 },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', lat: 18.5289, lng: 73.8744, platforms: 6 },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', lat: 21.1518, lng: 79.0882, platforms: 8 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0265, lng: 72.6008, platforms: 12 },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', lat: 21.2049, lng: 72.8411, platforms: 4 },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', lat: 22.3106, lng: 73.1809, platforms: 7 },
  { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat', lat: 22.3125, lng: 70.8022, platforms: 5 },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2683, lng: 77.4136, platforms: 6 },
  { code: 'RKMP', name: 'Rani Kamalapati', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2295, lng: 77.4385, platforms: 5 },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7177, lng: 75.8685, platforms: 6 },
  { code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1656, lng: 79.9504, platforms: 6 },
  { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2568, lng: 81.6296, platforms: 7 },

  // North India & Rajasthan
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6429, lng: 77.2191, platforms: 16 },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', lat: 28.5889, lng: 77.2535, platforms: 9 },
  { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi', lat: 28.6619, lng: 77.228, platforms: 16 },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', lat: 26.9196, lng: 75.7878, platforms: 7 },
  { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2838, lng: 73.0219, platforms: 5 },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', lat: 24.5701, lng: 73.6993, platforms: 5 },
  { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', lat: 25.2237, lng: 75.8809, platforms: 4 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1578, lng: 77.9896, platforms: 6 },
  { code: 'LKO', name: 'Lucknow Charbagh NR', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8317, lng: 80.9218, platforms: 9 },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4539, lng: 80.3511, platforms: 10 },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3266, lng: 82.9862, platforms: 9 },
  { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4448, lng: 81.8295, platforms: 10 },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7588, lng: 83.3822, platforms: 10 },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', lat: 31.6331, lng: 74.8669, platforms: 7 },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7016, lng: 76.8214, platforms: 6 },
  { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', lat: 30.3137, lng: 78.0338, platforms: 4 },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7069, lng: 74.8794, platforms: 3 },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu & Kashmir', lat: 32.9862, lng: 74.9482, platforms: 3 },

  // East & Northeast India
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', lat: 22.5839, lng: 88.3426, platforms: 23 },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', lat: 22.5673, lng: 88.3708, platforms: 21 },
  { code: 'NJP', name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal', lat: 26.6828, lng: 88.4426, platforms: 6 },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', lat: 25.6033, lng: 85.1376, platforms: 10 },
  { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', lat: 23.3522, lng: 85.3441, platforms: 6 },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand', lat: 22.7689, lng: 86.2003, platforms: 5 },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2666, lng: 85.8436, platforms: 6 },
  { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', lat: 19.8077, lng: 85.8396, platforms: 8 },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1822, lng: 91.7512, platforms: 7 },
  { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.912, platforms: 4 },
];

export const STATION_MAP: Record<string, Station> = Object.fromEntries(
  STATIONS.map((s) => [s.code, s])
);

function stop(
  code: string,
  arrival: string,
  departure: string,
  haltMinutes: number,
  distanceKm: number,
  day: number,
  platform: string
): TrainStop {
  const s = STATION_MAP[code];
  return {
    stationCode: code,
    stationName: s.name,
    city: s.city,
    arrival,
    departure,
    haltMinutes,
    distanceKm,
    day,
    platform,
    lat: s.lat,
    lng: s.lng,
  };
}

/**
 * Computes realistic Indian Railways distance-based fares (INR) by class and train category.
 */
export function computeRealisticFare(
  distanceKm: number,
  classCode: TravelClassCode,
  category: Train['category']
): number {
  const isPremium = category === 'Vande Bharat' || category === 'Rajdhani' || category === 'Shatabdi';
  const ratePerKm: Record<TravelClassCode, number> = {
    '1A': isPremium ? 3.55 : 3.25,
    '2A': isPremium ? 2.15 : 1.9,
    '3A': isPremium ? 1.52 : 1.32,
    '3E': 1.18,
    SL: 0.48,
    CC: isPremium ? 2.25 : 1.45,
    EC: isPremium ? 4.35 : 2.9,
    '2S': 0.34,
  };
  const baseMin: Record<TravelClassCode, number> = {
    '1A': 950,
    '2A': 620,
    '3A': 480,
    '3E': 420,
    SL: 175,
    CC: 420,
    EC: 880,
    '2S': 115,
  };
  const raw = Math.max(baseMin[classCode], Math.round((distanceKm * ratePerKm[classCode]) / 5) * 5);
  return raw;
}

export const TRAINS: Train[] = [
  // 1. Bengaluru - Dharwad Vande Bharat
  {
    number: '20661',
    name: 'KSR Bengaluru - Dharwad Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'SBC',
    toCode: 'UBL',
    departureTime: '05:45',
    arrivalTime: '11:40',
    durationMinutes: 355,
    durationLabel: '5h 55m',
    distanceKm: 470,
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 80,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1165, status: 'AVAILABLE', count: 64, statusText: 'AVL 64', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2110, status: 'AVAILABLE', count: 14, statusText: 'AVL 14', coachPrefix: 'E' },
    ],
    stops: [stop('SBC', 'Origin', '05:45', 0, 0, 1, '1'), stop('YPR', '05:55', '05:57', 2, 6, 1, '2'), stop('UBL', '11:40', 'Destination', 0, 470, 1, '3')],
  },
  // 2. Bengaluru - Mysuru Vande Bharat
  {
    number: '20607',
    name: 'MGR Chennai - Mysuru Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'MAS',
    toCode: 'MYS',
    departureTime: '05:50',
    arrivalTime: '12:25',
    durationMinutes: 395,
    durationLabel: '6h 35m',
    distanceKm: 500,
    runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 76,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1200, status: 'AVAILABLE', count: 96, statusText: 'AVL 96', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2295, status: 'AVAILABLE', count: 18, statusText: 'AVL 18', coachPrefix: 'E' },
    ],
    stops: [stop('MAS', 'Origin', '05:50', 0, 0, 1, '4'), stop('SBC', '10:20', '10:25', 5, 362, 1, '7'), stop('MYS', '12:25', 'Destination', 0, 500, 1, '2')],
  },
  // 3. Bengaluru - Goa Express
  {
    number: '17309',
    name: 'Yesvantpur - Vasco-da-Gama Express',
    category: 'Mail/Express',
    fromCode: 'SBC',
    toCode: 'MAO',
    departureTime: '14:30',
    arrivalTime: '05:10',
    durationMinutes: 880,
    durationLabel: '14h 40m',
    distanceKm: 676,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD', 'SS'],
    pantry: false,
    avgSpeedKmph: 46,
    hasBioVacuum: true,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 1520, status: 'AVAILABLE', count: 9, statusText: 'AVL 9', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1065, status: 'AVAILABLE', count: 29, statusText: 'AVL 29', coachPrefix: 'B' },
      { classCode: '3E', className: 'AC 3 Economy', fare: 960, status: 'AVAILABLE', count: 44, statusText: 'AVL 44', coachPrefix: 'M' },
      { classCode: 'SL', className: 'Sleeper', fare: 395, status: 'RAC', count: 6, statusText: 'RAC 6', coachPrefix: 'S' },
    ],
    stops: [stop('SBC', 'Origin', '14:30', 0, 0, 1, '4'), stop('UBL', '22:15', '22:30', 15, 470, 1, '1'), stop('MAO', '05:10', 'Destination', 0, 676, 2, '2')],
  },
  // 4. Goa Express (MAO -> NDLS)
  {
    number: '12779',
    name: 'Goa Express',
    category: 'Superfast',
    fromCode: 'MAO',
    toCode: 'NDLS',
    departureTime: '15:00',
    arrivalTime: '06:25',
    durationMinutes: 2365,
    durationLabel: '39h 25m',
    distanceKm: 2180,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 56,
    hasBioVacuum: true,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 2980, status: 'AVAILABLE', count: 11, statusText: 'AVL 11', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2045, status: 'AVAILABLE', count: 38, statusText: 'AVL 38', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 795, status: 'RAC', count: 12, statusText: 'RAC 12', coachPrefix: 'S' },
    ],
    stops: [
      stop('MAO', 'Origin', '15:00', 0, 0, 1, '1'),
      stop('UBL', '20:15', '20:25', 10, 206, 1, '2'),
      stop('PUNE', '04:05', '04:15', 10, 682, 2, '4'),
      stop('BPL', '19:45', '19:55', 10, 1478, 2, '2'),
      stop('AGC', '03:10', '03:15', 5, 1985, 3, '2'),
      stop('NDLS', '06:25', 'Destination', 0, 2180, 3, '5'),
    ],
  },
  // 5. Mumbai - Delhi Tejas Rajdhani
  {
    number: '12951',
    name: 'Mumbai Central - New Delhi Tejas Rajdhani',
    category: 'Rajdhani',
    fromCode: 'MMCT',
    toCode: 'NDLS',
    departureTime: '17:00',
    arrivalTime: '08:32',
    durationMinutes: 932,
    durationLabel: '15h 32m',
    distanceKm: 1386,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 89,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 4910, status: 'AVAILABLE', count: 5, statusText: 'AVL 5', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 2890, status: 'AVAILABLE', count: 28, statusText: 'AVL 28', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2075, status: 'AVAILABLE', count: 61, statusText: 'AVL 61', coachPrefix: 'B' },
    ],
    stops: [
      stop('MMCT', 'Origin', '17:00', 0, 0, 1, '1'),
      stop('ST', '19:43', '19:48', 5, 263, 1, '1'),
      stop('BRC', '21:06', '21:16', 10, 392, 1, '2'),
      stop('KOTA', '03:20', '03:30', 10, 920, 2, '1'),
      stop('NDLS', '08:32', 'Destination', 0, 1386, 2, '3'),
    ],
  },
  // 6. CSMT - NDLS Rajdhani
  {
    number: '22221',
    name: 'CSMT - Hazrat Nizamuddin Rajdhani',
    category: 'Rajdhani',
    fromCode: 'CSMT',
    toCode: 'NZM',
    departureTime: '16:00',
    arrivalTime: '09:55',
    durationMinutes: 1075,
    durationLabel: '17h 55m',
    distanceKm: 1538,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 86,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 5240, status: 'AVAILABLE', count: 4, statusText: 'AVL 4', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 3110, status: 'AVAILABLE', count: 22, statusText: 'AVL 22', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2215, status: 'AVAILABLE', count: 49, statusText: 'AVL 49', coachPrefix: 'B' },
    ],
    stops: [
      stop('CSMT', 'Origin', '16:00', 0, 0, 1, '16'),
      stop('BPL', '02:05', '02:15', 10, 837, 2, '1'),
      stop('AGC', '07:20', '07:22', 2, 1344, 2, '2'),
      stop('NZM', '09:55', 'Destination', 0, 1538, 2, '4'),
    ],
  },
  // 7. Bengaluru - Delhi Rajdhani
  {
    number: '22691',
    name: 'KSR Bengaluru - Hazrat Nizamuddin Rajdhani',
    category: 'Rajdhani',
    fromCode: 'SBC',
    toCode: 'NZM',
    departureTime: '20:00',
    arrivalTime: '05:30',
    durationMinutes: 2010,
    durationLabel: '33h 30m',
    distanceKm: 2368,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 71,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 6780, status: 'AVAILABLE', count: 3, statusText: 'AVL 3', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 4010, status: 'AVAILABLE', count: 19, statusText: 'AVL 19', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2820, status: 'AVAILABLE', count: 43, statusText: 'AVL 43', coachPrefix: 'B' },
    ],
    stops: [
      stop('SBC', 'Origin', '20:00', 0, 0, 1, '3'),
      stop('SC', '07:20', '07:35', 15, 672, 2, '1'),
      stop('NGP', '15:40', '15:50', 10, 1278, 2, '2'),
      stop('BPL', '20:55', '21:05', 10, 1667, 2, '1'),
      stop('AGC', '02:55', '03:00', 5, 2174, 3, '1'),
      stop('NZM', '05:30', 'Destination', 0, 2368, 3, '7'),
    ],
  },
  // 8. New Delhi - Varanasi Vande Bharat
  {
    number: '22436',
    name: 'New Delhi - Varanasi Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'NDLS',
    toCode: 'BSB',
    departureTime: '06:00',
    arrivalTime: '14:00',
    durationMinutes: 480,
    durationLabel: '8h 00m',
    distanceKm: 759,
    runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 95,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1805, status: 'AVAILABLE', count: 95, statusText: 'AVL 95', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 3355, status: 'AVAILABLE', count: 18, statusText: 'AVL 18', coachPrefix: 'E' },
    ],
    stops: [
      stop('NDLS', 'Origin', '06:00', 0, 0, 1, '16'),
      stop('CNB', '10:08', '10:13', 5, 440, 1, '1'),
      stop('PRYJ', '12:08', '12:10', 2, 634, 1, '1'),
      stop('BSB', '14:00', 'Destination', 0, 759, 1, '5'),
    ],
  },
  // 9. Howrah - New Delhi Rajdhani
  {
    number: '12301',
    name: 'Howrah - New Delhi Rajdhani Express',
    category: 'Rajdhani',
    fromCode: 'HWH',
    toCode: 'NDLS',
    departureTime: '16:50',
    arrivalTime: '10:05',
    durationMinutes: 1035,
    durationLabel: '17h 15m',
    distanceKm: 1451,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 84,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 5120, status: 'AVAILABLE', count: 7, statusText: 'AVL 7', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 3045, status: 'AVAILABLE', count: 31, statusText: 'AVL 31', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2150, status: 'RAC', count: 4, statusText: 'RAC 4', coachPrefix: 'B' },
    ],
    stops: [
      stop('HWH', 'Origin', '16:50', 0, 0, 1, '9'),
      stop('PRYJ', '04:43', '04:45', 2, 817, 2, '2'),
      stop('CNB', '07:05', '07:10', 5, 1011, 2, '4'),
      stop('NDLS', '10:05', 'Destination', 0, 1451, 2, '2'),
    ],
  },
  // 10. Bengaluru - Mumbai Udyan Express
  {
    number: '11302',
    name: 'Udyan Express',
    category: 'Mail/Express',
    fromCode: 'SBC',
    toCode: 'CSMT',
    departureTime: '20:40',
    arrivalTime: '20:15',
    durationMinutes: 1415,
    durationLabel: '23h 35m',
    distanceKm: 1136,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 48,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 3490, status: 'AVAILABLE', count: 4, statusText: 'AVL 4', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 2045, status: 'AVAILABLE', count: 16, statusText: 'AVL 16', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1425, status: 'AVAILABLE', count: 52, statusText: 'AVL 52', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 535, status: 'WL', count: 18, statusText: 'WL 18', coachPrefix: 'S' },
    ],
    stops: [
      stop('SBC', 'Origin', '20:40', 0, 0, 1, '2'),
      stop('PUNE', '16:15', '16:25', 10, 944, 2, '3'),
      stop('CSMT', '20:15', 'Destination', 0, 1136, 2, '14'),
    ],
  },
  // 11. Chennai - Mysuru Shatabdi
  {
    number: '12007',
    name: 'Chennai - Mysuru Shatabdi Express',
    category: 'Shatabdi',
    fromCode: 'MAS',
    toCode: 'MYS',
    departureTime: '06:00',
    arrivalTime: '13:00',
    durationMinutes: 420,
    durationLabel: '7h 00m',
    distanceKm: 500,
    runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 71,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1210, status: 'AVAILABLE', count: 82, statusText: 'AVL 82', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2245, status: 'AVAILABLE', count: 19, statusText: 'AVL 19', coachPrefix: 'E' },
    ],
    stops: [
      stop('MAS', 'Origin', '06:00', 0, 0, 1, '5'),
      stop('SBC', '10:45', '10:55', 10, 362, 1, '7'),
      stop('MYS', '13:00', 'Destination', 0, 500, 1, '1'),
    ],
  },
  // 12. Chennai - Bengaluru Mail
  {
    number: '12657',
    name: 'Bengaluru Mail',
    category: 'Superfast',
    fromCode: 'MAS',
    toCode: 'SBC',
    departureTime: '22:50',
    arrivalTime: '04:35',
    durationMinutes: 345,
    durationLabel: '5h 45m',
    distanceKm: 362,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: false,
    avgSpeedKmph: 63,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 1580, status: 'AVAILABLE', count: 6, statusText: 'AVL 6', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 960, status: 'AVAILABLE', count: 24, statusText: 'AVL 24', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 685, status: 'AVAILABLE', count: 47, statusText: 'AVL 47', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 265, status: 'AVAILABLE', count: 88, statusText: 'AVL 88', coachPrefix: 'S' },
    ],
    stops: [stop('MAS', 'Origin', '22:50', 0, 0, 1, '3'), stop('SBC', '04:35', 'Destination', 0, 362, 2, '1')],
  },
  // 13. Mumbai - Ahmedabad Vande Bharat
  {
    number: '20901',
    name: 'Mumbai Central - Gandhinagar Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'MMCT',
    toCode: 'ADI',
    departureTime: '06:00',
    arrivalTime: '11:25',
    durationMinutes: 325,
    durationLabel: '5h 25m',
    distanceKm: 492,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 91,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1420, status: 'AVAILABLE', count: 78, statusText: 'AVL 78', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2630, status: 'AVAILABLE', count: 16, statusText: 'AVL 16', coachPrefix: 'E' },
    ],
    stops: [
      stop('MMCT', 'Origin', '06:00', 0, 0, 1, '1'),
      stop('ST', '08:50', '08:53', 3, 263, 1, '2'),
      stop('BRC', '10:08', '10:12', 4, 392, 1, '1'),
      stop('ADI', '11:25', 'Destination', 0, 492, 1, '2'),
    ],
  },
  // 14. CSMT - Madgaon Vande Bharat
  {
    number: '22229',
    name: 'CSMT - Madgaon Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'CSMT',
    toCode: 'MAO',
    departureTime: '05:25',
    arrivalTime: '13:10',
    durationMinutes: 465,
    durationLabel: '7h 45m',
    distanceKm: 586,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 76,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1595, status: 'AVAILABLE', count: 54, statusText: 'AVL 54', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2915, status: 'AVAILABLE', count: 12, statusText: 'AVL 12', coachPrefix: 'E' },
    ],
    stops: [stop('CSMT', 'Origin', '05:25', 0, 0, 1, '14'), stop('MAO', '13:10', 'Destination', 0, 586, 1, '1')],
  },
  // 15. New Delhi - Katra Vande Bharat
  {
    number: '22439',
    name: 'New Delhi - Shri Mata Vaishno Devi Katra Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'NDLS',
    toCode: 'SVDK',
    departureTime: '06:00',
    arrivalTime: '14:00',
    durationMinutes: 480,
    durationLabel: '8h 00m',
    distanceKm: 655,
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 82,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1665, status: 'AVAILABLE', count: 68, statusText: 'AVL 68', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 3055, status: 'AVAILABLE', count: 15, statusText: 'AVL 15', coachPrefix: 'E' },
    ],
    stops: [stop('NDLS', 'Origin', '06:00', 0, 0, 1, '16'), stop('JAT', '12:35', '12:37', 2, 577, 1, '1'), stop('SVDK', '14:00', 'Destination', 0, 655, 1, '1')],
  },
  // 16. New Delhi - Bhopal Rani Kamalapati Vande Bharat
  {
    number: '20172',
    name: 'Hazrat Nizamuddin - Rani Kamalapati Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'NZM',
    toCode: 'RKMP',
    departureTime: '14:40',
    arrivalTime: '22:16',
    durationMinutes: 456,
    durationLabel: '7h 36m',
    distanceKm: 701,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 92,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1735, status: 'AVAILABLE', count: 84, statusText: 'AVL 84', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 3185, status: 'AVAILABLE', count: 17, statusText: 'AVL 17', coachPrefix: 'E' },
    ],
    stops: [stop('NZM', 'Origin', '14:40', 0, 0, 1, '3'), stop('AGC', '16:23', '16:25', 2, 188, 1, '1'), stop('RKMP', '22:16', 'Destination', 0, 701, 1, '1')],
  },
  // 17. Chennai - New Delhi Tamil Nadu Express
  {
    number: '12621',
    name: 'Tamil Nadu Superfast Express',
    category: 'Superfast',
    fromCode: 'MAS',
    toCode: 'NDLS',
    departureTime: '22:00',
    arrivalTime: '06:35',
    durationMinutes: 1955,
    durationLabel: '32h 35m',
    distanceKm: 2182,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 67,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 5280, status: 'AVAILABLE', count: 4, statusText: 'AVL 4', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 3095, status: 'AVAILABLE', count: 18, statusText: 'AVL 18', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2135, status: 'AVAILABLE', count: 45, statusText: 'AVL 45', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 825, status: 'AVAILABLE', count: 92, statusText: 'AVL 92', coachPrefix: 'S' },
    ],
    stops: [
      stop('MAS', 'Origin', '22:00', 0, 0, 1, '6'),
      stop('BZA', '04:05', '04:15', 10, 431, 2, '1'),
      stop('NGP', '14:05', '14:15', 10, 1094, 2, '3'),
      stop('BPL', '19:45', '19:55', 10, 1483, 2, '2'),
      stop('AGC', '03:15', '03:18', 3, 1987, 3, '1'),
      stop('NDLS', '06:35', 'Destination', 0, 2182, 3, '4'),
    ],
  },
  // 18. Thiruvananthapuram - New Delhi Kerala Express
  {
    number: '12625',
    name: 'Kerala Superfast Express',
    category: 'Superfast',
    fromCode: 'TVC',
    toCode: 'NDLS',
    departureTime: '12:30',
    arrivalTime: '13:15',
    durationMinutes: 2925,
    durationLabel: '48h 45m',
    distanceKm: 3032,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 62,
    hasBioVacuum: true,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 3745, status: 'AVAILABLE', count: 14, statusText: 'AVL 14', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2560, status: 'AVAILABLE', count: 36, statusText: 'AVL 36', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 985, status: 'AVAILABLE', count: 74, statusText: 'AVL 74', coachPrefix: 'S' },
    ],
    stops: [
      stop('TVC', 'Origin', '12:30', 0, 0, 1, '2'),
      stop('ERS', '16:25', '16:30', 5, 220, 1, '3'),
      stop('CBE', '20:15', '20:20', 5, 412, 1, '1'),
      stop('BZA', '11:45', '11:55', 10, 1280, 2, '2'),
      stop('NGP', '21:40', '21:50', 10, 1943, 2, '1'),
      stop('BPL', '03:20', '03:30', 10, 2332, 3, '2'),
      stop('NDLS', '13:15', 'Destination', 0, 3032, 3, '8'),
    ],
  },
  // 19. Howrah - Chennai Coromandel Express
  {
    number: '12841',
    name: 'Coromandel Superfast Express',
    category: 'Superfast',
    fromCode: 'HWH',
    toCode: 'MAS',
    departureTime: '15:20',
    arrivalTime: '16:50',
    durationMinutes: 1530,
    durationLabel: '25h 30m',
    distanceKm: 1659,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 65,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 4380, status: 'AVAILABLE', count: 5, statusText: 'AVL 5', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 2570, status: 'AVAILABLE', count: 21, statusText: 'AVL 21', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1785, status: 'AVAILABLE', count: 54, statusText: 'AVL 54', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 685, status: 'AVAILABLE', count: 108, statusText: 'AVL 108', coachPrefix: 'S' },
    ],
    stops: [
      stop('HWH', 'Origin', '15:20', 0, 0, 1, '21'),
      stop('BBS', '21:30', '21:35', 5, 437, 1, '1'),
      stop('VSKP', '03:45', '04:05', 20, 880, 2, '4'),
      stop('BZA', '09:45', '09:55', 10, 1229, 2, '3'),
      stop('MAS', '16:50', 'Destination', 0, 1659, 2, '7'),
    ],
  },
  // 20. Howrah - Puri Vande Bharat
  {
    number: '22895',
    name: 'Howrah - Puri Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'HWH',
    toCode: 'PURI',
    departureTime: '06:10',
    arrivalTime: '12:35',
    durationMinutes: 385,
    durationLabel: '6h 25m',
    distanceKm: 500,
    runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 78,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1430, status: 'AVAILABLE', count: 88, statusText: 'AVL 88', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2615, status: 'AVAILABLE', count: 16, statusText: 'AVL 16', coachPrefix: 'E' },
    ],
    stops: [stop('HWH', 'Origin', '06:10', 0, 0, 1, '20'), stop('BBS', '11:12', '11:14', 2, 437, 1, '2'), stop('PURI', '12:35', 'Destination', 0, 500, 1, '4')],
  },
  // 21. Guwahati - New Jalpaiguri - Howrah Vande Bharat
  {
    number: '22228',
    name: 'Guwahati - New Jalpaiguri Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'GHY',
    toCode: 'NJP',
    departureTime: '16:30',
    arrivalTime: '22:00',
    durationMinutes: 330,
    durationLabel: '5h 30m',
    distanceKm: 411,
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 75,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1075, status: 'AVAILABLE', count: 72, statusText: 'AVL 72', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2025, status: 'AVAILABLE', count: 14, statusText: 'AVL 14', coachPrefix: 'E' },
    ],
    stops: [stop('GHY', 'Origin', '16:30', 0, 0, 1, '1'), stop('NJP', '22:00', 'Destination', 0, 411, 1, '2')],
  },
  // 22. New Delhi - Dibrugarh Rajdhani
  {
    number: '12424',
    name: 'New Delhi - Dibrugarh Town Rajdhani',
    category: 'Rajdhani',
    fromCode: 'NDLS',
    toCode: 'DBRG',
    departureTime: '16:20',
    arrivalTime: '04:00',
    durationMinutes: 2140,
    durationLabel: '35h 40m',
    distanceKm: 2438,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 68,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 7120, status: 'AVAILABLE', count: 4, statusText: 'AVL 4', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 4190, status: 'AVAILABLE', count: 18, statusText: 'AVL 18', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 2945, status: 'AVAILABLE', count: 39, statusText: 'AVL 39', coachPrefix: 'B' },
    ],
    stops: [
      stop('NDLS', 'Origin', '16:20', 0, 0, 1, '14'),
      stop('CNB', '21:02', '21:07', 5, 440, 1, '2'),
      stop('PRYJ', '23:08', '23:10', 2, 634, 1, '3'),
      stop('NJP', '11:50', '12:00', 10, 1465, 2, '1'),
      stop('GHY', '18:35', '18:50', 15, 1876, 2, '1'),
      stop('DBRG', '04:00', 'Destination', 0, 2438, 3, '2'),
    ],
  },
  // 23. Jaipur - Delhi Double Decker
  {
    number: '12985',
    name: 'Jaipur - Delhi Sarai Rohilla Double Decker',
    category: 'Superfast',
    fromCode: 'JP',
    toCode: 'NDLS',
    departureTime: '06:00',
    arrivalTime: '10:30',
    durationMinutes: 270,
    durationLabel: '4h 30m',
    distanceKm: 304,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: false,
    avgSpeedKmph: 68,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 510, status: 'AVAILABLE', count: 140, statusText: 'AVL 140', coachPrefix: 'C' },
      { classCode: '2S', className: 'Second Sitting', fare: 185, status: 'AVAILABLE', count: 210, statusText: 'AVL 210', coachPrefix: 'D' },
    ],
    stops: [stop('JP', 'Origin', '06:00', 0, 0, 1, '2'), stop('NDLS', '10:30', 'Destination', 0, 304, 1, '6')],
  },
  // 24. New Delhi - Lucknow Tejas Express
  {
    number: '82502',
    name: 'New Delhi - Lucknow IRCTC Tejas Express',
    category: 'Shatabdi',
    fromCode: 'NDLS',
    toCode: 'LKO',
    departureTime: '15:35',
    arrivalTime: '22:05',
    durationMinutes: 390,
    durationLabel: '6h 30m',
    distanceKm: 511,
    runningDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ'],
    pantry: true,
    avgSpeedKmph: 79,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1465, status: 'AVAILABLE', count: 74, statusText: 'AVL 74', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2495, status: 'AVAILABLE', count: 12, statusText: 'AVL 12', coachPrefix: 'E' },
    ],
    stops: [stop('NDLS', 'Origin', '15:35', 0, 0, 1, '9'), stop('CNB', '20:35', '20:40', 5, 440, 1, '1'), stop('LKO', '22:05', 'Destination', 0, 511, 1, '3')],
  },
  // 25. New Delhi - Amritsar Shatabdi
  {
    number: '12013',
    name: 'New Delhi - Amritsar Swarna Shatabdi',
    category: 'Shatabdi',
    fromCode: 'NDLS',
    toCode: 'ASR',
    departureTime: '16:30',
    arrivalTime: '22:35',
    durationMinutes: 365,
    durationLabel: '6h 05m',
    distanceKm: 448,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 74,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1120, status: 'AVAILABLE', count: 91, statusText: 'AVL 91', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2040, status: 'AVAILABLE', count: 15, statusText: 'AVL 15', coachPrefix: 'E' },
    ],
    stops: [stop('NDLS', 'Origin', '16:30', 0, 0, 1, '1'), stop('ASR', '22:35', 'Destination', 0, 448, 1, '2')],
  },
  // 26. New Delhi - Chandigarh - Kalka Shatabdi
  {
    number: '12005',
    name: 'New Delhi - Chandigarh Shatabdi Express',
    category: 'Shatabdi',
    fromCode: 'NDLS',
    toCode: 'CDG',
    departureTime: '17:15',
    arrivalTime: '20:38',
    durationMinutes: 203,
    durationLabel: '3h 23m',
    distanceKm: 266,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 79,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 845, status: 'AVAILABLE', count: 104, statusText: 'AVL 104', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 1545, status: 'AVAILABLE', count: 20, statusText: 'AVL 20', coachPrefix: 'E' },
    ],
    stops: [stop('NDLS', 'Origin', '17:15', 0, 0, 1, '1'), stop('CDG', '20:38', 'Destination', 0, 266, 1, '1')],
  },
  // 27. Secunderabad - Bengaluru SF
  {
    number: '12785',
    name: 'Kacheguda - KSR Bengaluru SF Express',
    category: 'Superfast',
    fromCode: 'SC',
    toCode: 'SBC',
    departureTime: '19:05',
    arrivalTime: '06:25',
    durationMinutes: 680,
    durationLabel: '11h 20m',
    distanceKm: 618,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: false,
    avgSpeedKmph: 55,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 2290, status: 'AVAILABLE', count: 2, statusText: 'AVL 2', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 1380, status: 'AVAILABLE', count: 17, statusText: 'AVL 17', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 965, status: 'AVAILABLE', count: 55, statusText: 'AVL 55', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 365, status: 'AVAILABLE', count: 114, statusText: 'AVL 114', coachPrefix: 'S' },
    ],
    stops: [stop('SC', 'Origin', '19:05', 0, 0, 1, '4'), stop('SBC', '06:25', 'Destination', 0, 618, 2, '5')],
  },
  // 28. Secunderabad - Visakhapatnam Vande Bharat
  {
    number: '20834',
    name: 'Secunderabad - Visakhapatnam Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'SC',
    toCode: 'VSKP',
    departureTime: '15:00',
    arrivalTime: '23:30',
    durationMinutes: 510,
    durationLabel: '8h 30m',
    distanceKm: 699,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 82,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1665, status: 'AVAILABLE', count: 71, statusText: 'AVL 71', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 3120, status: 'AVAILABLE', count: 14, statusText: 'AVL 14', coachPrefix: 'E' },
    ],
    stops: [stop('SC', 'Origin', '15:00', 0, 0, 1, '1'), stop('BZA', '19:00', '19:05', 5, 349, 1, '1'), stop('VSKP', '23:30', 'Destination', 0, 699, 1, '2')],
  },
  // 29. Bengaluru - Mangaluru Express
  {
    number: '16585',
    name: 'SMVT Bengaluru - Mangaluru Central Express',
    category: 'Mail/Express',
    fromCode: 'SBC',
    toCode: 'MAQ',
    departureTime: '20:30',
    arrivalTime: '07:15',
    durationMinutes: 645,
    durationLabel: '10h 45m',
    distanceKm: 412,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD', 'SS'],
    pantry: false,
    avgSpeedKmph: 39,
    hasBioVacuum: true,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 1020, status: 'AVAILABLE', count: 14, statusText: 'AVL 14', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 715, status: 'AVAILABLE', count: 41, statusText: 'AVL 41', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 275, status: 'AVAILABLE', count: 96, statusText: 'AVL 96', coachPrefix: 'S' },
    ],
    stops: [stop('SBC', 'Origin', '20:30', 0, 0, 1, '6'), stop('MYS', '23:10', '23:15', 5, 138, 1, '3'), stop('MAQ', '07:15', 'Destination', 0, 412, 2, '1')],
  },
  // 30. Nilgiri Mountain Railway
  {
    number: '56136',
    name: 'Nilgiri Mountain Railway (Mettupalayam - Ooty)',
    category: 'Mail/Express',
    fromCode: 'MTP',
    toCode: 'UAM',
    departureTime: '07:10',
    arrivalTime: '12:00',
    durationMinutes: 290,
    durationLabel: '4h 50m',
    distanceKm: 46,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN'],
    pantry: false,
    avgSpeedKmph: 10,
    hasBioVacuum: false,
    classes: [
      { classCode: 'EC', className: 'First Class Heritage', fare: 600, status: 'AVAILABLE', count: 18, statusText: 'AVL 18', coachPrefix: 'FC' },
      { classCode: '2S', className: 'Second Sitting', fare: 295, status: 'AVAILABLE', count: 48, statusText: 'AVL 48', coachPrefix: 'D' },
    ],
    stops: [stop('MTP', 'Origin', '07:10', 0, 0, 1, '1'), stop('UAM', '12:00', 'Destination', 0, 46, 1, '1')],
  },
  // 31. Mumbai - Pune Deccan Queen
  {
    number: '12123',
    name: 'Deccan Queen Superfast Express',
    category: 'Superfast',
    fromCode: 'CSMT',
    toCode: 'PUNE',
    departureTime: '17:10',
    arrivalTime: '20:25',
    durationMinutes: 195,
    durationLabel: '3h 15m',
    distanceKm: 192,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 59,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 440, status: 'AVAILABLE', count: 120, statusText: 'AVL 120', coachPrefix: 'C' },
      { classCode: '2S', className: 'Second Sitting', fare: 115, status: 'AVAILABLE', count: 240, statusText: 'AVL 240', coachPrefix: 'D' },
    ],
    stops: [stop('CSMT', 'Origin', '17:10', 0, 0, 1, '10'), stop('PUNE', '20:25', 'Destination', 0, 192, 1, '1')],
  },
  // 32. Patna - Howrah Vande Bharat
  {
    number: '22348',
    name: 'Patna - Howrah Vande Bharat',
    category: 'Vande Bharat',
    fromCode: 'PNBE',
    toCode: 'HWH',
    departureTime: '08:00',
    arrivalTime: '14:35',
    durationMinutes: 395,
    durationLabel: '6h 35m',
    distanceKm: 532,
    runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'LD'],
    pantry: true,
    avgSpeedKmph: 81,
    hasBioVacuum: true,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 1505, status: 'AVAILABLE', count: 82, statusText: 'AVL 82', coachPrefix: 'C' },
      { classCode: 'EC', className: 'Executive Chair Car', fare: 2725, status: 'AVAILABLE', count: 15, statusText: 'AVL 15', coachPrefix: 'E' },
    ],
    stops: [stop('PNBE', 'Origin', '08:00', 0, 0, 1, '1'), stop('HWH', '14:35', 'Destination', 0, 532, 1, '12')],
  },
  // 33. Howrah - Mumbai CSMT Gitanjali Express
  {
    number: '12860',
    name: 'Gitanjali Superfast Express',
    category: 'Superfast',
    fromCode: 'HWH',
    toCode: 'CSMT',
    departureTime: '14:05',
    arrivalTime: '21:20',
    durationMinutes: 1875,
    durationLabel: '31h 15m',
    distanceKm: 1968,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: true,
    avgSpeedKmph: 63,
    hasBioVacuum: true,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 2880, status: 'AVAILABLE', count: 16, statusText: 'AVL 16', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1985, status: 'AVAILABLE', count: 44, statusText: 'AVL 44', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 765, status: 'AVAILABLE', count: 86, statusText: 'AVL 86', coachPrefix: 'S' },
    ],
    stops: [
      stop('HWH', 'Origin', '14:05', 0, 0, 1, '17'),
      stop('TATA', '17:25', '17:35', 10, 250, 1, '2'),
      stop('R', '02:40', '02:50', 10, 830, 2, '1'),
      stop('NGP', '07:20', '07:30', 10, 1131, 2, '2'),
      stop('CSMT', '21:20', 'Destination', 0, 1968, 2, '18'),
    ],
  },
  // 34. New Delhi - Patna Rajdhani
  {
    number: '12310',
    name: 'Rajendra Nagar Patna Tejas Rajdhani',
    category: 'Rajdhani',
    fromCode: 'NDLS',
    toCode: 'PNBE',
    departureTime: '17:10',
    arrivalTime: '04:40',
    durationMinutes: 690,
    durationLabel: '11h 30m',
    distanceKm: 1000,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD'],
    pantry: true,
    avgSpeedKmph: 87,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 4110, status: 'AVAILABLE', count: 6, statusText: 'AVL 6', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 2435, status: 'AVAILABLE', count: 24, statusText: 'AVL 24', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1755, status: 'AVAILABLE', count: 52, statusText: 'AVL 52', coachPrefix: 'B' },
    ],
    stops: [
      stop('NDLS', 'Origin', '17:10', 0, 0, 1, '12'),
      stop('CNB', '21:52', '21:57', 5, 440, 1, '1'),
      stop('PRYJ', '23:53', '23:55', 2, 634, 1, '2'),
      stop('PNBE', '04:40', 'Destination', 0, 1000, 2, '1'),
    ],
  },
  // 35. Indore - Mumbai Avantika Express
  {
    number: '12962',
    name: 'Avantika Superfast Express',
    category: 'Superfast',
    fromCode: 'INDB',
    toCode: 'MMCT',
    departureTime: '17:40',
    arrivalTime: '06:40',
    durationMinutes: 780,
    durationLabel: '13h 00m',
    distanceKm: 829,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    applicableQuotas: ['GN', 'TQ', 'PT', 'LD', 'SS'],
    pantry: false,
    avgSpeedKmph: 64,
    hasBioVacuum: true,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 2840, status: 'AVAILABLE', count: 4, statusText: 'AVL 4', coachPrefix: 'H' },
      { classCode: '2A', className: 'Second AC', fare: 1690, status: 'AVAILABLE', count: 19, statusText: 'AVL 19', coachPrefix: 'A' },
      { classCode: '3A', className: 'Third AC', fare: 1185, status: 'AVAILABLE', count: 46, statusText: 'AVL 46', coachPrefix: 'B' },
      { classCode: 'SL', className: 'Sleeper', fare: 455, status: 'AVAILABLE', count: 94, statusText: 'AVL 94', coachPrefix: 'S' },
    ],
    stops: [stop('INDB', 'Origin', '17:40', 0, 0, 1, '1'), stop('BRC', '01:02', '01:07', 5, 437, 2, '1'), stop('ST', '02:48', '02:53', 5, 566, 2, '1'), stop('MMCT', '06:40', 'Destination', 0, 829, 2, '2')],
  },
];

/**
 * Computes live IST schedule-based position for demonstration telemetry.
 * Clearly labelled as simulated schedule telemetry when live NTES feeds are unavailable.
 */
export function computeLiveTrainPosition(train: Train) {
  const now = new Date();
  // Convert to IST (UTC+05:30)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffsetMs);
  const currentMinutesOfDay = istNow.getUTCHours() * 60 + istNow.getUTCMinutes();

  const [depH, depM] = train.departureTime.split(':').map(Number);
  const depMinutes = depH * 60 + depM;

  let elapsed = currentMinutesOfDay - depMinutes;
  if (elapsed < 0) elapsed += 24 * 60;
  const progressPct = Math.min(96, Math.max(6, Math.round(((elapsed % train.durationMinutes) / train.durationMinutes) * 100)));

  const stopCount = train.stops.length;
  const currentIdx = Math.min(
    Math.max(0, stopCount - 2),
    Math.floor((progressPct / 100) * Math.max(stopCount - 1, 1))
  );
  const currentStop = train.stops[currentIdx] || train.stops[0];
  const nextStop = train.stops[currentIdx + 1] || train.stops[stopCount - 1];
  const distanceCoveredKm = Math.round((train.distanceKm * progressPct) / 100);
  const currentSpeedKmph = Math.max(42, Math.min(130, train.avgSpeedKmph + (istNow.getUTCSeconds() % 17) - 6));

  return {
    progressPct,
    currentStop,
    nextStop,
    currentIdx,
    distanceCoveredKm,
    currentSpeedKmph,
    istTime: `${String(istNow.getUTCHours()).padStart(2, '0')}:${String(istNow.getUTCMinutes()).padStart(2, '0')}:${String(istNow.getUTCSeconds()).padStart(2, '0')} IST`,
    isSimulatedTelemetry: true,
  };
}

export const DESTINATIONS: Destination[] = [
  {
    slug: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    stationCode: 'SBC',
    tagline: 'Canopy boulevards & southern rail gateway',
    editorialDescription:
      'A high-altitude metropolis framed by rain-washed banyans, filter coffee counters, and Vande Bharat corridors fanning out across the Deccan.',
    bestTime: 'Oct – Feb',
    signatureTrain: '20607 Vande Bharat',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Bengaluru Vidhana Soudha',
    highlights: ['Lalbagh Botanical', 'Cubbon Park', 'Vande Bharat Hub'],
    fromHubs: [
      { fromCode: 'MAS', duration: '5h 45m', startingFare: 265 },
      { fromCode: 'SC', duration: '11h 20m', startingFare: 365 },
    ],
  },
  {
    slug: 'mysuru',
    city: 'Mysuru',
    state: 'Karnataka',
    stationCode: 'MYS',
    tagline: 'Royal boulevards two hours from Bengaluru',
    editorialDescription:
      'Sandstone colonnades, Chamundi Hill mist, and sandalwood-scented morning markets reached via the sweeping Cauvery basin.',
    bestTime: 'Sep – Mar',
    signatureTrain: '12007 Shatabdi Express',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Mysuru Palace',
    highlights: ['Mysore Palace', 'Chamundi Hills', 'Devaraja Market'],
    fromHubs: [
      { fromCode: 'SBC', duration: '1h 50m', startingFare: 550 },
      { fromCode: 'MAS', duration: '7h 00m', startingFare: 1210 },
    ],
  },
  {
    slug: 'goa',
    city: 'Goa',
    state: 'Goa',
    stationCode: 'MAO',
    tagline: 'Western Ghats tunnels to Konkan tidelines',
    editorialDescription:
      'Cross Dudhsagar’s monsoon mist and laterite ridges before emerging onto palm-lined estuaries at Madgaon Junction.',
    bestTime: 'Nov – Feb',
    signatureTrain: '12779 Goa Express',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Goa Coastline',
    highlights: ['Dudhsagar Crossing', 'Fontainhas', 'South Goa Coves'],
    fromHubs: [
      { fromCode: 'SBC', duration: '14h 40m', startingFare: 395 },
      { fromCode: 'CSMT', duration: '7h 45m', startingFare: 1595 },
    ],
  },
  {
    slug: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    stationCode: 'CSMT',
    tagline: 'Victorian Gothic termini & coastal energy',
    editorialDescription:
      'Arrive beneath the stone domes of CSMT where overnight Rajdhani and Konkan expresses meet the Arabian Sea.',
    bestTime: 'Nov – Feb',
    signatureTrain: '12951 Tejas Rajdhani',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Mumbai CSMT',
    highlights: ['CSMT Heritage', 'Marine Drive', 'Kala Ghoda'],
    fromHubs: [
      { fromCode: 'NDLS', duration: '15h 32m', startingFare: 2075 },
      { fromCode: 'SBC', duration: '23h 35m', startingFare: 535 },
    ],
  },
  {
    slug: 'delhi',
    city: 'Delhi',
    state: 'Delhi',
    stationCode: 'NDLS',
    tagline: 'The northern meridian of Indian rail',
    editorialDescription:
      'Red sandstone avenues, tree-lined Lutyens circles, and the convergence point of India’s fastest Rajdhani and Vande Bharat lines.',
    bestTime: 'Oct – Mar',
    signatureTrain: '22436 Vande Bharat',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / New Delhi India Gate',
    highlights: ['Humayun’s Tomb', 'Lodhi Art District', 'Old Delhi'],
    fromHubs: [
      { fromCode: 'MMCT', duration: '15h 32m', startingFare: 2075 },
      { fromCode: 'JP', duration: '4h 30m', startingFare: 185 },
    ],
  },
  {
    slug: 'chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    stationCode: 'MAS',
    tagline: 'Red brick arches & Coromandel dawn',
    editorialDescription:
      'Where terracotta-hued Chennai Central welcomes dawn arrivals from Bengaluru, Mysuru, and the eastern coast.',
    bestTime: 'Dec – Feb',
    signatureTrain: '12657 Bengaluru Mail',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Chennai Architecture',
    highlights: ['Mylapore', 'Marina Promenade', 'Kapaleeshwarar'],
    fromHubs: [
      { fromCode: 'SBC', duration: '5h 45m', startingFare: 265 },
      { fromCode: 'MYS', duration: '7h 00m', startingFare: 1210 },
    ],
  },
  {
    slug: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    stationCode: 'SC',
    tagline: 'Deccan granite, pearls & timeless bazaars',
    editorialDescription:
      'Step off at Secunderabad into a city of minarets, lakefront promenades, and Irani chai houses.',
    bestTime: 'Oct – Feb',
    signatureTrain: '12785 Kacheguda SF',
    imageUrl: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Hyderabad Charminar',
    highlights: ['Charminar', 'Golconda Fort', 'Hussain Sagar'],
    fromHubs: [{ fromCode: 'SBC', duration: '11h 20m', startingFare: 365 }],
  },
  {
    slug: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    stationCode: 'HWH',
    tagline: 'Hooghly crossings & literary mornings',
    editorialDescription:
      'Cross the cantilevered steel span of Howrah Bridge straight into Howrah’s 23-platform riverfront terminal.',
    bestTime: 'Oct – Feb',
    signatureTrain: '12301 Howrah Rajdhani',
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Kolkata Howrah Bridge',
    highlights: ['Howrah Bridge', 'Victoria Memorial', 'College Street'],
    fromHubs: [{ fromCode: 'NDLS', duration: '17h 15m', startingFare: 2150 }],
  },
  {
    slug: 'ooty',
    city: 'Ooty',
    state: 'Tamil Nadu',
    stationCode: 'UAM',
    tagline: 'Rack-and-pinion ascent into Nilgiri clouds',
    editorialDescription:
      'Climb 2,240 metres through eucalyptus forests and 16 stone tunnels aboard the UNESCO-listed Nilgiri Mountain Railway.',
    bestTime: 'Apr – Jun, Sep – Nov',
    signatureTrain: '56136 Nilgiri Mountain',
    imageUrl: 'https://images.unsplash.com/photo-1580744755167-3709c4699c18?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Nilgiri Tea Estates',
    highlights: ['Toy Train Ascent', 'Doddabetta Peak', 'Tea Estates'],
    fromHubs: [{ fromCode: 'MTP', duration: '4h 50m', startingFare: 295 }],
  },
  {
    slug: 'varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    stationCode: 'BSB',
    tagline: 'Ancient riverfront ghats at high speed',
    editorialDescription:
      'Travel from New Delhi to Kashi in eight hours aboard the Vande Bharat, arriving in time for evening Ganga aarti.',
    bestTime: 'Nov – Mar',
    signatureTrain: '22436 Vande Bharat',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Varanasi Ghats',
    highlights: ['Dashashwamedh Ghat', 'Sarnath', 'Silk Weavers'],
    fromHubs: [{ fromCode: 'NDLS', duration: '8h 00m', startingFare: 1805 }],
  },
  {
    slug: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    stationCode: 'JP',
    tagline: 'Terracotta facades & desert observatory skies',
    editorialDescription:
      'Step out into the Pink City’s symmetrical bazaars, sandstone stepwells, and hill-fort ramparts.',
    bestTime: 'Oct – Mar',
    signatureTrain: '12985 Double Decker',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Jaipur Hawa Mahal',
    highlights: ['Hawa Mahal', 'Amer Fort', 'Jantar Mantar'],
    fromHubs: [{ fromCode: 'NDLS', duration: '4h 30m', startingFare: 185 }],
  },
  {
    slug: 'mangaluru',
    city: 'Mangaluru',
    state: 'Karnataka',
    stationCode: 'MAQ',
    tagline: 'Shiradi Ghat mist to Arabian Sea harbours',
    editorialDescription:
      'Descend the emerald Sakleshpur ghats overnight to wake up beside terracotta-tiled coastal homes and Arabian Sea surf.',
    bestTime: 'Oct – Feb',
    signatureTrain: '16585 Mangaluru Express',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash / Coastal Karnataka',
    highlights: ['Sakleshpur Ghats', 'Panambur Beach', 'Kudroli'],
    fromHubs: [{ fromCode: 'SBC', duration: '10h 45m', startingFare: 275 }],
  },
];

/**
 * Generates an interactive demonstration coach berth layout.
 * Clearly distinguishes demonstration layout from official IRCTC berth assignment.
 */
export function generateCoachLayout(classCode: TravelClassCode): CoachBerth[] {
  const isChairCar = classCode === 'CC' || classCode === 'EC' || classCode === '2S';
  const berths: CoachBerth[] = [];

  if (isChairCar) {
    const totalRows = 8;
    let num = 1;
    for (let bay = 1; bay <= totalRows; bay++) {
      const types: ('WS' | 'MS' | 'AS')[] = classCode === 'EC' ? ['WS', 'AS', 'AS', 'WS'] : ['WS', 'MS', 'AS', 'AS', 'WS'];
      for (const t of types) {
        const occupied = (num * 7 + bay) % 5 === 0;
        const rac = !occupied && num % 17 === 0;
        berths.push({
          id: `${classCode}-${num}`,
          number: num,
          berthType: t,
          bay,
          status: occupied ? 'OCCUPIED' : rac ? 'RAC' : 'AVAILABLE',
          accessible: num <= 2,
        });
        num++;
      }
    }
    return berths;
  }

  const bays = 6;
  let num = 1;
  for (let bay = 1; bay <= bays; bay++) {
    const mainPattern: ('LB' | 'MB' | 'UB')[] =
      classCode === '1A' || classCode === '2A'
        ? ['LB', 'UB', 'LB', 'UB']
        : ['LB', 'MB', 'UB', 'LB', 'MB', 'UB'];

    for (const bt of mainPattern) {
      const occupied = (num * 13 + bay * 3) % 4 === 0;
      const rac = !occupied && num % 11 === 0;
      berths.push({
        id: `${classCode}-${num}`,
        number: num,
        berthType: bt,
        bay,
        status: occupied ? 'OCCUPIED' : rac ? 'RAC' : 'AVAILABLE',
        accessible: bay === 1 && bt === 'LB',
      });
      num++;
    }

    if (classCode !== '1A') {
      const sidePattern: ('SL' | 'SU')[] = ['SL', 'SU'];
      for (const st of sidePattern) {
        const occupied = (num * 5 + bay) % 4 === 0;
        const rac = !occupied && st === 'SL' && bay % 3 === 0;
        berths.push({
          id: `${classCode}-${num}`,
          number: num,
          berthType: st,
          bay,
          side: true,
          status: occupied ? 'OCCUPIED' : rac ? 'RAC' : 'AVAILABLE',
          accessible: bay === 1 && st === 'SL',
        });
        num++;
      }
    }
  }

  return berths;
}
