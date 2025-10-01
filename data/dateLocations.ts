
import { DateSuggestion, LocationArea } from '../types/DateSuggestion';

export const enuguAreas: LocationArea[] = [
  { name: 'Independence Layout', description: 'Upscale residential area with modern amenities' },
  { name: 'New Haven', description: 'Central location with shopping and dining' },
  { name: 'Trans-Ekulu', description: 'Developing area with recreational facilities' },
  { name: 'GRA', description: 'Government Reserved Area with parks and gardens' },
  { name: 'Coal Camp', description: 'Historic area with cultural significance' },
  { name: 'Uwani', description: 'University area with youthful atmosphere' },
  { name: 'Ogui', description: 'Commercial hub with markets and eateries' },
  { name: 'Abakpa Nike', description: 'Suburban area with natural scenery' },
];

export const dateSuggestions: DateSuggestion[] = [
  // Romantic Locations
  {
    id: '1',
    name: 'Polo Park Mall Rooftop',
    description: 'Enjoy a romantic dinner with city views at the rooftop restaurants in Polo Park Mall.',
    category: 'romantic',
    priceRange: 'moderate',
    location: 'Independence Layout',
    estimatedCost: 8000,
    duration: '2-3 hours',
    bestTimeToVisit: 'Evening (6-9 PM)',
    coordinates: { latitude: 6.4698, longitude: 7.5262 },
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500',
    tags: ['dinner', 'city view', 'romantic', 'mall']
  },
  {
    id: '2',
    name: 'Milken Hill Resort',
    description: 'A serene hilltop resort perfect for couples seeking privacy and beautiful landscapes.',
    category: 'romantic',
    priceRange: 'premium',
    location: 'Enugu-Onitsha Expressway',
    estimatedCost: 15000,
    duration: '4-6 hours',
    bestTimeToVisit: 'Afternoon to Evening',
    coordinates: { latitude: 6.4500, longitude: 7.5000 },
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500',
    tags: ['resort', 'hilltop', 'privacy', 'landscape']
  },

  // Adventure Locations
  {
    id: '3',
    name: 'Awhum Waterfall',
    description: 'Adventure hike to the beautiful Awhum Waterfall with natural caves and swimming opportunities.',
    category: 'adventure',
    priceRange: 'budget',
    location: 'Awhum (30 mins from Enugu)',
    estimatedCost: 3000,
    duration: '4-6 hours',
    bestTimeToVisit: 'Morning (8 AM - 12 PM)',
    coordinates: { latitude: 6.3500, longitude: 7.4500 },
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    tags: ['waterfall', 'hiking', 'swimming', 'nature']
  },
  {
    id: '4',
    name: 'Nike Lake Resort',
    description: 'Water sports, boat rides, and lakeside activities for adventurous couples.',
    category: 'adventure',
    priceRange: 'moderate',
    location: 'Abakpa Nike',
    estimatedCost: 7000,
    duration: '3-5 hours',
    bestTimeToVisit: 'Morning to Afternoon',
    coordinates: { latitude: 6.4200, longitude: 7.5500 },
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
    tags: ['lake', 'water sports', 'boat rides', 'resort']
  },

  // Cultural Locations
  {
    id: '5',
    name: 'National Museum Enugu',
    description: 'Explore Igbo culture and history together at the National Museum.',
    category: 'cultural',
    priceRange: 'budget',
    location: 'Independence Layout',
    estimatedCost: 1500,
    duration: '2-3 hours',
    bestTimeToVisit: 'Morning (9 AM - 12 PM)',
    coordinates: { latitude: 6.4650, longitude: 7.5200 },
    imageUrl: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=500',
    tags: ['museum', 'culture', 'history', 'educational']
  },
  {
    id: '6',
    name: 'Ngwo Pine Forest',
    description: 'Walk through the mystical pine forest and discover the hidden cave and waterfall.',
    category: 'cultural',
    priceRange: 'budget',
    location: 'Ngwo (20 mins from Enugu)',
    estimatedCost: 2500,
    duration: '3-4 hours',
    bestTimeToVisit: 'Morning to Afternoon',
    coordinates: { latitude: 6.5000, longitude: 7.4800 },
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    tags: ['forest', 'cave', 'waterfall', 'nature walk']
  },

  // Relaxing Locations
  {
    id: '7',
    name: 'Michael Okpara Square',
    description: 'Peaceful park in the heart of Enugu perfect for picnics and relaxation.',
    category: 'relaxing',
    priceRange: 'budget',
    location: 'Independence Layout',
    estimatedCost: 1000,
    duration: '2-4 hours',
    bestTimeToVisit: 'Afternoon (3-6 PM)',
    coordinates: { latitude: 6.4600, longitude: 7.5150 },
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    tags: ['park', 'picnic', 'relaxation', 'city center']
  },
  {
    id: '8',
    name: 'Ebeano Supermarket Garden',
    description: 'Beautiful garden area behind Ebeano Supermarket, perfect for quiet conversations.',
    category: 'relaxing',
    priceRange: 'budget',
    location: 'Independence Layout',
    estimatedCost: 500,
    duration: '1-2 hours',
    bestTimeToVisit: 'Evening (5-7 PM)',
    coordinates: { latitude: 6.4680, longitude: 7.5180 },
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    tags: ['garden', 'quiet', 'conversation', 'peaceful']
  },

  // Food Locations
  {
    id: '9',
    name: 'Shoprite Food Court',
    description: 'Variety of dining options in a comfortable, air-conditioned environment.',
    category: 'food',
    priceRange: 'moderate',
    location: 'Independence Layout',
    estimatedCost: 5000,
    duration: '1-2 hours',
    bestTimeToVisit: 'Lunch or Dinner',
    coordinates: { latitude: 6.4700, longitude: 7.5250 },
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
    tags: ['food court', 'variety', 'air conditioning', 'shopping']
  },
  {
    id: '10',
    name: 'Local Pepper Soup Joints',
    description: 'Experience authentic Enugu pepper soup at local joints in Ogbete Market area.',
    category: 'food',
    priceRange: 'budget',
    location: 'Ogui',
    estimatedCost: 2000,
    duration: '1-2 hours',
    bestTimeToVisit: 'Evening (6-8 PM)',
    coordinates: { latitude: 6.4400, longitude: 7.4900 },
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
    tags: ['local cuisine', 'pepper soup', 'authentic', 'market']
  },

  // Outdoor Locations
  {
    id: '11',
    name: 'Enugu Golf Course',
    description: 'Enjoy a round of golf or simply walk the beautiful greens together.',
    category: 'outdoor',
    priceRange: 'premium',
    location: 'GRA',
    estimatedCost: 12000,
    duration: '3-4 hours',
    bestTimeToVisit: 'Morning (7-11 AM)',
    coordinates: { latitude: 6.4550, longitude: 7.5100 },
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500',
    tags: ['golf', 'greens', 'sport', 'upscale']
  },
  {
    id: '12',
    name: 'Udi Hills Picnic Spot',
    description: 'Scenic hilltop location perfect for outdoor picnics with panoramic views.',
    category: 'outdoor',
    priceRange: 'budget',
    location: 'Udi (25 mins from Enugu)',
    estimatedCost: 2000,
    duration: '4-6 hours',
    bestTimeToVisit: 'Morning to Afternoon',
    coordinates: { latitude: 6.3200, longitude: 7.4200 },
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    tags: ['hills', 'picnic', 'panoramic view', 'outdoor']
  }
];
