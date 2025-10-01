
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { DateSuggestion, UserPreferences } from '@/types/DateSuggestion';
import { formatCurrency } from '@/utils/recommendationEngine';
import { supabase } from '@/app/integrations/supabase/client';
import { useRouter } from 'expo-router';

interface RecommendationsListProps {
  recommendations: DateSuggestion[];
  preferences: UserPreferences;
  onBack: () => void;
}

export default function RecommendationsList({ 
  recommendations, 
  preferences, 
  onBack 
}: RecommendationsListProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    saveSearchHistory();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const saveSearchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return; // Don't save if user is not logged in

      const { error } = await supabase
        .from('recent_searches')
        .insert({
          user_id: user.id,
          search_query: preferences,
          search_results: recommendations,
        });

      if (error) {
        console.error('Error saving search history:', error);
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('favorite_places')
        .select('place_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favorites:', error);
      } else {
        const favoriteIds = new Set(data?.map(fav => fav.place_id) || []);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (suggestion: DateSuggestion) => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to save favorite places.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth') },
        ]
      );
      return;
    }

    const isFavorite = favorites.has(suggestion.id);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_places')
          .delete()
          .eq('user_id', user.id)
          .eq('place_id', suggestion.id);

        if (error) {
          console.error('Error removing favorite:', error);
          Alert.alert('Error', 'Failed to remove from favorites.');
        } else {
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(suggestion.id);
            return newFavorites;
          });
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_places')
          .insert({
            user_id: user.id,
            place_id: suggestion.id,
            place_name: suggestion.name,
            place_description: suggestion.description,
            place_category: suggestion.category,
            place_location: suggestion.location,
            place_image_url: suggestion.imageUrl,
          });

        if (error) {
          console.error('Error adding favorite:', error);
          Alert.alert('Error', 'Failed to add to favorites.');
        } else {
          setFavorites(prev => new Set(prev).add(suggestion.id));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites.');
    }
  };
  
  const handleLocationPress = (suggestion: DateSuggestion) => {
    Alert.alert(
      "Location Info",
      `${suggestion.name} is located in ${suggestion.location}.\n\nNote: Maps are not supported in Natively right now, but you can search for this location in your preferred maps app.`,
      [
        { text: "OK", style: "default" }
      ]
    );
  };

  const handleCallLocation = (suggestion: DateSuggestion) => {
    Alert.alert(
      "Contact Info",
      `For more information about ${suggestion.name}, you can search online or visit the location directly at ${suggestion.location}.`,
      [
        { text: "OK", style: "default" }
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return 'heart.fill';
      case 'adventure': return 'mountain.2';
      case 'cultural': return 'building.columns';
      case 'relaxing': return 'leaf';
      case 'food': return 'fork.knife';
      case 'outdoor': return 'tree';
      default: return 'location';
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return colors.accent;
      case 'moderate': return colors.secondary;
      case 'premium': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  if (recommendations.length === 0) {
    return (
      <View style={[commonStyles.container]}>
        {Platform.OS !== 'ios' && (
          <View style={styles.androidHeader}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <IconSymbol name="chevron.left" color={colors.text} size={24} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.androidHeaderTitle}>No Results</Text>
          </View>
        )}
        <View style={styles.emptyContainer}>
          <IconSymbol name="exclamationmark.triangle" color={colors.textSecondary} size={48} />
          <Text style={styles.emptyTitle}>No Recommendations Found</Text>
          <Text style={styles.emptyText}>
            We couldn&apos;t find any locations matching your preferences. Try adjusting your budget or style preferences.
          </Text>
          <TouchableOpacity style={styles.tryAgainButton} onPress={onBack}>
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[commonStyles.wrapper]}>
      {Platform.OS !== 'ios' && (
        <View style={styles.androidHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <IconSymbol name="chevron.left" color={colors.text} size={24} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.androidHeaderTitle}>Recommendations</Text>
        </View>
      )}
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentAndroid
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={commonStyles.title}>Perfect Matches for You!</Text>
          <Text style={commonStyles.textSecondary}>
            Based on your {preferences.style} style and {preferences.budget} budget
          </Text>
        </View>

        <View style={styles.recommendationsContainer}>
          {recommendations.map((suggestion) => (
            <View key={suggestion.id} style={styles.recommendationCard}>
              <Image 
                source={{ uri: suggestion.imageUrl }} 
                style={styles.cardImage}
                defaultSource={require('@/assets/images/natively-dark.png')}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <IconSymbol 
                      name={getCategoryIcon(suggestion.category) as any} 
                      color={colors.primary} 
                      size={20} 
                    />
                    <Text style={styles.cardTitle}>{suggestion.name}</Text>
                  </View>
                  <View style={[
                    styles.priceTag, 
                    { backgroundColor: getPriceRangeColor(suggestion.priceRange) }
                  ]}>
                    <Text style={styles.priceText}>{formatCurrency(suggestion.estimatedCost)}</Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{suggestion.description}</Text>

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <IconSymbol name="location" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>{suggestion.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="clock" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>{suggestion.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconSymbol name="sun.max" color={colors.textSecondary} size={16} />
                    <Text style={styles.detailText}>{suggestion.bestTimeToVisit}</Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {suggestion.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLocationPress(suggestion)}
                  >
                    <IconSymbol name="map" color={colors.primary} size={18} />
                    <Text style={styles.actionButtonText}>View Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleCallLocation(suggestion)}
                  >
                    <IconSymbol name="info.circle" color={colors.secondary} size={18} />
                    <Text style={styles.actionButtonText}>More Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.favoriteButton, favorites.has(suggestion.id) && styles.favoriteButtonActive]}
                    onPress={() => toggleFavorite(suggestion)}
                  >
                    <IconSymbol 
                      name={favorites.has(suggestion.id) ? "heart.fill" : "heart"} 
                      color={favorites.has(suggestion.id) ? colors.primary : colors.textSecondary} 
                      size={18} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.newSearchButton} onPress={onBack}>
            <IconSymbol name="arrow.clockwise" color="white" size={18} />
            <Text style={styles.newSearchButtonText}>New Search</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    paddingTop: Platform.OS === 'android' ? 50 : 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  androidHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 16,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContentAndroid: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recommendationsContainer: {
    gap: 20,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.highlight,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  newSearchButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  newSearchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
