export interface HotelReview {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  badge: string;
  title: string;
  comment: string;
  sentimentTags: string[];
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  category: "Luxury Heritage" | "Eco Safari Villa" | "Boutique Resort" | "5-Star Oceanfront" | "Colonial Tea Bungalow";
  stars: number;
  reviewScore: number;
  reviewCount: number;
  pricePerNightAUD: number;
  image: string;
  gallery: string[];
  amenities: string[];
  roomType: string;
  distanceToHighlight: string;
  badge?: string;
  reviews: HotelReview[];
}

export const HOTELS_CATALOG: Hotel[] = [
  // --- SIGIRIYA ---
  {
    id: "heritance-kandalama",
    name: "Heritance Kandalama",
    destinationId: "sigiriya",
    category: "Luxury Heritage",
    stars: 5,
    reviewScore: 9.6,
    reviewCount: 384,
    pricePerNightAUD: 295,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    ],
    amenities: ["Geoffrey Bawa Architecture", "3 Cliff Infinity Pools", "Ayurvedic Six Senses Spa", "Sigiriya Rock Views", "Wild Monkey & Bird Haven"],
    roomType: "Superior Panoramic Jungle Room",
    distanceToHighlight: "15 min to Sigiriya Lion Rock",
    badge: "Architectural Wonder",
    reviews: [
      {
        id: "rev-hk-1",
        author: "David & Chloe M.",
        location: "Melbourne, Australia",
        date: "October 2026",
        rating: 9.8,
        badge: "Couples Holiday",
        title: "Living inside a tropical cliff masterpiece",
        comment: "Designed by Geoffrey Bawa, this hotel literally grows into the rock cliff face. Waking up to monkeys swinging past our balcony and direct views of Sigiriya Rock across the lake was surreal.",
        sentimentTags: ["Unmatched Architecture", "Incredible Breakfast Buffet", "Infinity Pool Views"],
      },
      {
        id: "rev-hk-2",
        author: "Liam K.",
        location: "Sydney, Australia",
        date: "September 2026",
        rating: 9.5,
        badge: "Photography Enthusiast",
        title: "Pure cinematic Sri Lanka",
        comment: "Staff packed us a 5:30 AM breakfast basket for our sunrise hike up Lion Rock. The sunset pool overlooking the misty lake is unforgettable.",
        sentimentTags: ["World Class Staff", "Serene Nature", "Five Star Comfort"],
      },
    ],
  },
  {
    id: "water-garden-sigiriya",
    name: "Water Garden Sigiriya",
    destinationId: "sigiriya",
    category: "Eco Safari Villa",
    stars: 5,
    reviewScore: 9.8,
    reviewCount: 196,
    pricePerNightAUD: 380,
    image: "https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    ],
    amenities: ["Private Plunge Pool Villas", "Unobstructed Lion Rock View", "Helipad Access", "Organic Farm-to-Table Dining"],
    roomType: "Deluxe Water Villa with Private Pool",
    distanceToHighlight: "6 km to Lion Rock Citadel",
    badge: "Ultimate Privacy",
    reviews: [
      {
        id: "rev-wgs-1",
        author: "Amanda & Brett T.",
        location: "Perth, Australia",
        date: "August 2026",
        rating: 10.0,
        badge: "Honeymooners",
        title: "Heaven on earth with Lion Rock right outside our pool",
        comment: "Sitting in our private villa pool sipping fresh king coconuts with Sigiriya standing proud on the horizon. Top tier luxury, unmatched serenity.",
        sentimentTags: ["Private Plunge Pool", "Breathtaking Views", "Exceptional Butler"],
      },
    ],
  },

  // --- ELLA ---
  {
    id: "98-acres-resort",
    name: "98 Acres Resort & Spa",
    destinationId: "ella",
    category: "Boutique Resort",
    stars: 5,
    reviewScore: 9.7,
    reviewCount: 420,
    pricePerNightAUD: 320,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    ],
    amenities: ["Tea Plantation Chalets", "Ella Rock Panoramic Balcony", "Helipad Access", "Ravana Pool Club Privilege", "Eco-crafted Timber Design"],
    roomType: "Executive Mountain View Chalet",
    distanceToHighlight: "10 min walk to Little Adam's Peak & Nine Arch Bridge",
    badge: "Most Iconic Ella Stay",
    reviews: [
      {
        id: "rev-98-1",
        author: "Jason & Michelle R.",
        location: "Brisbane, Australia",
        date: "October 2026",
        rating: 9.9,
        badge: "Scenic Getaway",
        title: "The best mountain resort in Asia bar none",
        comment: "Perched on a 98-acre tea estate overlooking Ella Gap. The blue train whistles in the distance through the mist. The breakfast served on the cliff edge was sheer bliss.",
        sentimentTags: ["Breathtaking Ella Gap", "Trek Directly from Room", "Amazing Ceylon Tea"],
      },
    ],
  },
  {
    id: "chill-villa-ella",
    name: "The Mountain Heavens Ella",
    destinationId: "ella",
    category: "Boutique Resort",
    stars: 4,
    reviewScore: 9.3,
    reviewCount: 215,
    pricePerNightAUD: 165,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Panoramic Mountain Terrace", "Infinity Pool over Ella Gap", "Craft Cocktails", "Guided Waterfall Hikes"],
    roomType: "Deluxe Balcony Valley Suite",
    distanceToHighlight: "1.2 km to Ella Town",
    badge: "Best Value Views",
    reviews: [
      {
        id: "rev-mh-1",
        author: "Natasha P.",
        location: "Sydney, Australia",
        date: "September 2026",
        rating: 9.4,
        badge: "Solo Adventure",
        title: "Mesmerizing views of Ella Gap",
        comment: "You don't even need to leave your balcony to see Ella Rock and the waterfalls. Perfect quiet retreat after the blue train journey.",
        sentimentTags: ["Epic Sunrises", "Friendly Hosts", "Great Coffee"],
      },
    ],
  },

  // --- YALA ---
  {
    id: "cinnamon-wild-yala",
    name: "Cinnamon Wild Yala",
    destinationId: "yala",
    category: "Eco Safari Villa",
    stars: 5,
    reviewScore: 9.5,
    reviewCount: 310,
    pricePerNightAUD: 340,
    image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Direct Border to Yala National Park", "Private 4x4 Safari Jeeps", "Rooftop Observation Deck", "Wild Boar & Elephant Watch Bar"],
    roomType: "Jungle Chalet with Forest Canopy Balcony",
    distanceToHighlight: "3 min drive to Yala Park Gate",
    badge: "Direct Wildlife Encounters",
    reviews: [
      {
        id: "rev-cwy-1",
        author: "Greg & Family (Adelaide, AU)",
        location: "Adelaide, Australia",
        date: "October 2026",
        rating: 9.7,
        badge: "Family Safari",
        title: "Elephants outside our chalets at night!",
        comment: "Guards walk you to your chalet at dusk because wild animals roam freely between the scrub and the Indian Ocean. Our morning safari scored 3 leopard sightings!",
        sentimentTags: ["Genuine Wild Safari", "Expert Trackers", "Sunset Beach Bar"],
      },
    ],
  },
  {
    id: "wild-coast-tented-lodge",
    name: "Wild Coast Tented Lodge (Relais & Châteaux)",
    destinationId: "yala",
    category: "Eco Safari Villa",
    stars: 5,
    reviewScore: 9.9,
    reviewCount: 154,
    pricePerNightAUD: 680,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Cocoon Luxury Tents", "Freeform Bawa-Inspired Stone Pool", "Private Naturalist Included", "All-Inclusive Fine Dining"],
    roomType: "Cocoon Suite with Private Plunge Pool",
    distanceToHighlight: "Nestled where the jungle meets the rugged southern ocean",
    badge: "Ultra-Luxury Safari",
    reviews: [
      {
        id: "rev-wctl-1",
        author: "Nicholas S.",
        location: "Melbourne, Australia",
        date: "August 2026",
        rating: 10.0,
        badge: "Luxury Traveler",
        title: "The pinnacle of safari architecture in the world",
        comment: "The cocoon tents mimic boulders scattered on the beach. Gourmet dining under the southern cross, private bespoke safari jeeps with passionate naturalists.",
        sentimentTags: ["Peak Luxury", "Exceptional Safari Naturalist", "Gourmet All-Inclusive"],
      },
    ],
  },

  // --- GALLE ---
  {
    id: "amangalla",
    name: "Amangalla (Aman Resorts)",
    destinationId: "galle",
    category: "Luxury Heritage",
    stars: 5,
    reviewScore: 9.8,
    reviewCount: 180,
    pricePerNightAUD: 520,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["17th-Century Colonial Manor", "The Baths Hydrotherapy Spa", "Heritage Verandah High Tea", "Antique Teak & Rattan Suites"],
    roomType: "Historic Fort Chamber with Four-Poster Bed",
    distanceToHighlight: "Inside Galle Fort UNESCO Ramparts",
    badge: "Aman Heritage Luxury",
    reviews: [
      {
        id: "rev-aman-1",
        author: "Charlotte & Henry V.",
        location: "Melbourne, Australia",
        date: "September 2026",
        rating: 10.0,
        badge: "Heritage Lovers",
        title: "Step back into the golden age of Ceylon travel",
        comment: "Polished century-old teak floors, antique chandeliers, and the soothing sound of afternoon rain on the verandah. Unmatched Aman grace inside Galle Fort.",
        sentimentTags: ["Historic Grandeur", "World Renowned Spa", "Walk to Fort Ramparts"],
      },
    ],
  },
  {
    id: "fort-bazaar",
    name: "The Fort Bazaar (Teardrop Hotels)",
    destinationId: "galle",
    category: "Boutique Resort",
    stars: 5,
    reviewScore: 9.6,
    reviewCount: 228,
    pricePerNightAUD: 260,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Restored 17th Century Merchant Home", "Church Street Social Fine Dining", "Z Spa Ayurvedic Treatments", "Courtyard Cinema"],
    roomType: "Banyan Bedroom with Private Fort Balcony",
    distanceToHighlight: "Directly on Church Street inside Galle Fort",
    badge: "Boutique Fort Vibe",
    reviews: [
      {
        id: "rev-fb-1",
        author: "Olivia W.",
        location: "Sydney, Australia",
        date: "October 2026",
        rating: 9.7,
        badge: "Food & Wine Explorer",
        title: "Chic modern sanctuary in the historic fort",
        comment: "Church Street Social serves the most incredible modern Sri Lankan seafood curry. Stepping out right onto cobblestone streets to explore jeweler and linen shops was amazing.",
        sentimentTags: ["Chic Design", "Superb Food", "Prime Fort Location"],
      },
    ],
  },

  // --- KANDY ---
  {
    id: "earls-regency-kandy",
    name: "Earl's Regency Hotel Kandy",
    destinationId: "kandy",
    category: "Luxury Heritage",
    stars: 5,
    reviewScore: 9.4,
    reviewCount: 340,
    pricePerNightAUD: 210,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Mahaweli River Mountain Views", "Ayurvedic Sanctuary", "Free-form Pool with Rock Cascades", "Kandyan Royal Cuisine"],
    roomType: "Premium River View Balcony Room",
    distanceToHighlight: "10 min to Temple of the Tooth",
    badge: "Royal Mountain Retreat",
    reviews: [
      {
        id: "rev-er-1",
        author: "Mark & Julie S.",
        location: "Perth, Australia",
        date: "September 2026",
        rating: 9.5,
        badge: "Family Holiday",
        title: "Peaceful haven away from the Kandy city bustle",
        comment: "Looking over the misty Mahaweli river valley with mountains all around. The hotel arranged private transport for the Temple of the Tooth evening ceremony seamlessly.",
        sentimentTags: ["Valley Views", "Great Hospitality", "Serene Pool"],
      },
    ],
  },

  // --- NUWARA ELIYA ---
  {
    id: "grand-hotel-nuwara-eliya",
    name: "The Grand Hotel Nuwara Eliya",
    destinationId: "nuwara-eliya",
    category: "Colonial Tea Bungalow",
    stars: 5,
    reviewScore: 9.6,
    reviewCount: 450,
    pricePerNightAUD: 245,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Elizabethan Architecture & Fireplaces", "Legendary High Tea on the Lawn", "Award-Winning Rose Gardens", "Billiards Room & Wine Cellar"],
    roomType: "Governor's Deluxe Wing Suite",
    distanceToHighlight: "Next to Nuwara Eliya Golf Club",
    badge: "130-Year Heritage",
    reviews: [
      {
        id: "rev-gh-1",
        author: "Edward & Valerie C.",
        location: "Melbourne, Australia",
        date: "October 2026",
        rating: 9.8,
        badge: "Classic Elegance",
        title: "Real wood fires and unforgettable High Tea",
        comment: "After a chilly evening at Gregory Lake, returning to our room with a hot water bottle slipped into the sheets and a real log fire in the lounge was pure nostalgia.",
        sentimentTags: ["High Tea on Lawn", "Crackling Log Fires", "Royal Service"],
      },
    ],
  },

  // --- MIRISSA & WELIGAMA ---
  {
    id: "w15-weligama",
    name: "W15 Weligama Beachfront",
    destinationId: "mirissa",
    category: "Boutique Resort",
    stars: 5,
    reviewScore: 9.5,
    reviewCount: 290,
    pricePerNightAUD: 230,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Direct Beachfront & Surf Break", "Beach Club with Resident DJ", "Infinity Edge Ocean Pool", "Seafood BBQ on the Sand"],
    roomType: "Ocean Terrace Sunset Suite",
    distanceToHighlight: "10 min drive to Mirissa Whale Harbour",
    badge: "Surf & Beach Vibe",
    reviews: [
      {
        id: "rev-w15-1",
        author: "Kieran B.",
        location: "Gold Coast, Australia",
        date: "September 2026",
        rating: 9.6,
        badge: "Surf & Chill",
        title: "Wake up, grab a surfboard, and hit gentle peelers",
        comment: "Weligama bay has the smoothest beginner-to-intermediate surf waves in Sri Lanka. W15 has the best chill tunes, sunset cocktails, and direct beach access.",
        sentimentTags: ["Surf at Your Doorstep", "Vibrant Sunset Music", "Amazing Cocktails"],
      },
    ],
  },

  // --- COLOMBO ---
  {
    id: "galle-face-hotel",
    name: "The Galle Face Hotel (Est. 1864)",
    destinationId: "colombo",
    category: "Luxury Heritage",
    stars: 5,
    reviewScore: 9.5,
    reviewCount: 520,
    pricePerNightAUD: 220,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Historic Oceanfront Terrace", "Saltwater Pool on the Indian Ocean", "Chequerboard Sunset Bar", "Bagpiper Flag Lowering Ceremony"],
    roomType: "Ocean View Landmark Suite",
    distanceToHighlight: "On Galle Face Green Promenade",
    badge: "Asia's Oldest Grand Hotel",
    reviews: [
      {
        id: "rev-gfh-1",
        author: "Anthony T.",
        location: "Sydney, Australia",
        date: "October 2026",
        rating: 9.6,
        badge: "Colonial Luxury",
        title: "Watching Indian Ocean waves crash against the terrace",
        comment: "Sipping a Lion Beer at the Chequerboard terrace while the sun dips into the sea with the bagpiper playing at sunset is a Sri Lankan tradition everyone must experience.",
        sentimentTags: ["Iconic Sunset Bar", "Historic Charm", "Saltwater Pool"],
      },
    ],
  },

  // --- BENTOTA ---
  {
    id: "taj-bentota-resort",
    name: "Taj Bentota Resort & Spa",
    destinationId: "bentota",
    category: "5-Star Oceanfront",
    stars: 5,
    reviewScore: 9.4,
    reviewCount: 310,
    pricePerNightAUD: 240,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
    amenities: ["Golden Sand Beachfront", "Jiva Ayurvedic Spa", "S.H.A.C.K. Fresh Seafood Restaurant", "Freeform Lagoon Pools"],
    roomType: "Superior Sea View Terrace Room",
    distanceToHighlight: "Direct on Bentota Beach",
    badge: "Golden Beach Luxury",
    reviews: [
      {
        id: "rev-taj-1",
        author: "Karen & Peter D.",
        location: "Melbourne, Australia",
        date: "August 2026",
        rating: 9.5,
        badge: "Relaxation",
        title: "Pure tropical unwind after touring the highlands",
        comment: "The beachfront gardens, coconut trees, and warm ocean swimming made this the ideal finish to our 12-day Sri Lanka holiday.",
        sentimentTags: ["Golden Beach", "Ayurvedic Massages", "Warm Hospitality"],
      },
    ],
  },
];
