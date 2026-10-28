export interface AustralianAirport {
  code: string;
  name: string;
  city: string;
  state: string;
  directToCMB: boolean;
  estFlightTime: string;
  recommendedAirlines: string[];
  baseFareAUD: number;
  popular: boolean;
}

export const AUSTRALIAN_AIRPORTS: AustralianAirport[] = [
  {
    code: "MEL",
    name: "Melbourne Tullamarine",
    city: "Melbourne",
    state: "VIC",
    directToCMB: true,
    estFlightTime: "10h 15m (Direct)",
    recommendedAirlines: ["SriLankan Airlines", "Singapore Airlines", "Malaysia Airlines"],
    baseFareAUD: 889,
    popular: true,
  },
  {
    code: "SYD",
    name: "Sydney Kingsford Smith",
    city: "Sydney",
    state: "NSW",
    directToCMB: true,
    estFlightTime: "10h 40m (Direct)",
    recommendedAirlines: ["SriLankan Airlines", "Singapore Airlines", "Malaysia Airlines"],
    baseFareAUD: 915,
    popular: true,
  },
  {
    code: "BNE",
    name: "Brisbane Airport",
    city: "Brisbane",
    state: "QLD",
    directToCMB: false,
    estFlightTime: "11h 50m (1-Stop)",
    recommendedAirlines: ["Singapore Airlines", "Malaysia Airlines", "Qantas / SriLankan"],
    baseFareAUD: 940,
    popular: true,
  },
  {
    code: "PER",
    name: "Perth International",
    city: "Perth",
    state: "WA",
    directToCMB: false,
    estFlightTime: "9h 10m (1-Stop via SIN/KUL)",
    recommendedAirlines: ["Singapore Airlines", "Malaysia Airlines", "AirAsia X"],
    baseFareAUD: 795,
    popular: true,
  },
  {
    code: "ADL",
    name: "Adelaide Airport",
    city: "Adelaide",
    state: "SA",
    directToCMB: false,
    estFlightTime: "11h 25m (1-Stop)",
    recommendedAirlines: ["Singapore Airlines", "Malaysia Airlines"],
    baseFareAUD: 920,
    popular: false,
  },
];
