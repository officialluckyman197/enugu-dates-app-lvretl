
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { Review } from '@/types/DateSuggestion';
import { dateSuggestions } from '@/data/dateLocations';

export default function RateReviewScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to view your reviews.');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reviews:', error);
        Alert.alert('Error', 'Failed to load reviews.');
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load reviews.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const submitReview = async () => {
    if (!selectedPlace || rating === 0) {
      Alert.alert('Missing Information', 'Please select a place and provide a rating.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to submit a review.');
        return;
      }

      const selectedSuggestion = dateSuggestions.find(s => s.id === selectedPlace);
      if (!selectedSuggestion) {
        Alert.alert('Error', 'Selected place not found.');
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          place_id: selectedPlace,
          place_name: selectedSuggestion.name,
          rating,
          review_text: reviewText.trim() || null,
        });

      if (error) {
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Failed to submit review.');
      } else {
        Alert.alert('Success', 'Review submitted successfully!');
        setShowAddReview(false);
        setSelectedPlace('');
        setRating(0);
        setReviewText('');
        loadReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        Alert.alert('Error', 'Failed to delete review.');
      } else {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        Alert.alert('Success', 'Review deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      Alert.alert('Error', 'Failed to delete review.');
    }
  };

  const confirmDeleteReview = (review: Review) => {
    Alert.alert(
      'Delete Review',
      `Are you sure you want to delete your review for "${review.place_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteReview(review.id) },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress?.(star)}
            disabled={!onPress}
          >
            <IconSymbol
              name={star <= rating ? 'star.fill' : 'star'}
              color={star <= rating ? '#FFD700' : colors.textSecondary}
              size={24}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  const renderReviewItem = (review: Review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewInfo}>
          <Text style={styles.placeName}>{review.place_name}</Text>
          <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteReview(review)}
        >
          <IconSymbol name="trash" color={colors.textSecondary} size={16} />
        </TouchableOpacity>
      </View>
      
      {renderStars(review.rating)}
      
      {review.review_text && (
        <Text style={styles.reviewText}>{review.review_text}</Text>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Rate & Review',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowAddReview(!showAddReview)} 
              style={styles.headerButton}
            >
              <IconSymbol 
                name={showAddReview ? 'xmark' : 'plus'} 
                color={colors.primary} 
                size={20} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentAndroid
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {showAddReview && (
            <View style={styles.addReviewContainer}>
              <Text style={styles.addReviewTitle}>Add New Review</Text>
              
              <Text style={styles.fieldLabel}>Select Place</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placesScroll}>
                {dateSuggestions.map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    style={[
                      styles.placeOption,
                      selectedPlace === place.id && styles.selectedPlace
                    ]}
                    onPress={() => setSelectedPlace(place.id)}
                  >
                    <Text style={[
                      styles.placeOptionText,
                      selectedPlace === place.id && styles.selectedPlaceText
                    ]}>
                      {place.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <Text style={styles.fieldLabel}>Rating</Text>
              {renderStars(rating, setRating)}
              
              <Text style={styles.fieldLabel}>Review (Optional)</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience..."
                placeholderTextColor={colors.textSecondary}
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.reviewActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddReview(false);
                    setSelectedPlace('');
                    setRating(0);
                    setReviewText('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.submitButton, submitting && styles.disabledButton]}
                  onPress={submitReview}
                  disabled={submitting}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading your reviews...</Text>
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="star" color={colors.textSecondary} size={64} />
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptyDescription}>
                Share your experiences by rating and reviewing the places you&apos;ve visited.
              </Text>
              {!showAddReview && (
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => setShowAddReview(true)}
                >
                  <Text style={styles.exploreButtonText}>Write First Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.reviewsContainer}>
              <Text style={styles.sectionTitle}>
                Your Reviews ({reviews.length})
              </Text>
              {reviews.map(renderReviewItem)}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContentAndroid: {
    paddingBottom: 100,
  },
  addReviewContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  addReviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  placesScroll: {
    marginBottom: 8,
  },
  placeOption: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  selectedPlace: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  placeOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedPlaceText: {
    color: 'white',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  reviewInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.highlight,
    minHeight: 100,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginTop: 12,
  },
});
