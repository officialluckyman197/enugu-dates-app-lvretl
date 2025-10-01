
import { DateSuggestion, UserPreferences } from '../types/DateSuggestion';
import { dateSuggestions } from '../data/dateLocations';

export function getRecommendations(preferences: UserPreferences): DateSuggestion[] {
  console.log('Getting recommendations for preferences:', preferences);
  
  let filteredSuggestions = dateSuggestions.filter(suggestion => {
    // Filter by budget
    const budgetMatch = suggestion.priceRange === preferences.budget;
    
    // Filter by style/category
    const styleMatch = suggestion.category === preferences.style;
    
    // Filter by location (if specific location is selected)
    const locationMatch = !preferences.location || 
                         preferences.location === 'any' || 
                         suggestion.location.toLowerCase().includes(preferences.location.toLowerCase());
    
    return budgetMatch && styleMatch && locationMatch;
  });

  // If no exact matches, relax the budget constraint
  if (filteredSuggestions.length === 0) {
    console.log('No exact matches found, relaxing budget constraint');
    filteredSuggestions = dateSuggestions.filter(suggestion => {
      const styleMatch = suggestion.category === preferences.style;
      const locationMatch = !preferences.location || 
                           preferences.location === 'any' || 
                           suggestion.location.toLowerCase().includes(preferences.location.toLowerCase());
      
      return styleMatch && locationMatch;
    });
  }

  // If still no matches, just filter by style
  if (filteredSuggestions.length === 0) {
    console.log('Still no matches, filtering by style only');
    filteredSuggestions = dateSuggestions.filter(suggestion => 
      suggestion.category === preferences.style
    );
  }

  // Sort by estimated cost (ascending for budget-conscious users)
  filteredSuggestions.sort((a, b) => {
    if (preferences.budget === 'budget') {
      return a.estimatedCost - b.estimatedCost;
    } else if (preferences.budget === 'premium') {
      return b.estimatedCost - a.estimatedCost;
    }
    return a.estimatedCost - b.estimatedCost;
  });

  console.log(`Found ${filteredSuggestions.length} recommendations`);
  return filteredSuggestions.slice(0, 6); // Return top 6 recommendations
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function getBudgetRange(budget: 'budget' | 'moderate' | 'premium'): string {
  switch (budget) {
    case 'budget':
      return '₦500 - ₦3,000';
    case 'moderate':
      return '₦3,000 - ₦10,000';
    case 'premium':
      return '₦10,000+';
    default:
      return '';
  }
}
