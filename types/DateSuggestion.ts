
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

export interface FavoritePlace {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  place_description?: string;
  place_category?: string;
  place_location?: string;
  place_image_url?: string;
  created_at: string;
}

export interface RecentSearch {
  id: string;
  user_id: string;
  search_query: UserPreferences;
  search_results?: DateSuggestion[];
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  location_sharing: boolean;
  preferred_budget: 'budget' | 'moderate' | 'premium';
  created_at: string;
  updated_at: string;
}
