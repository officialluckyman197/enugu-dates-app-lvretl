
export interface DateSuggestion {
  id: string;
  name: string;
  description: string;
  category: 'romantic' | 'adventure' | 'cultural' | 'relaxing' | 'food' | 'outdoor';
  priceRange: 'budget' | 'moderate' | 'premium';
  location: string;
  estimatedCost: number;
  duration: string;
  bestTimeToVisit: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  tags: string[];
}

export interface UserPreferences {
  budget: 'budget' | 'moderate' | 'premium';
  location: string;
  style: 'romantic' | 'adventure' | 'cultural' | 'relaxing' | 'food' | 'outdoor';
  groupSize: number;
}

export interface LocationArea {
  name: string;
  description: string;
}
