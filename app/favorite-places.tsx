
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { FavoritePlace } from '@/types/DateSuggestion';

export default function FavoritePlacesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to view your favorite places.');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('favorite_places')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        Alert.alert('Error', 'Failed to load favorite places.');
      } else {
        setFavorites(data || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite places.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorite_places')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        Alert.alert('Error', 'Failed to remove favorite place.');
      } else {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        Alert.alert('Success', 'Favorite place removed successfully.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove favorite place.');
    }
  };

  const confirmRemoveFavorite = (favorite: FavoritePlace) => {
    Alert.alert(
      'Remove Favorite',
      `Are you sure you want to remove "${favorite.place_name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(favorite.id) },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const renderFavoriteItem = (favorite: FavoritePlace) => (
    <View key={favorite.id} style={styles.favoriteCard}>
      {favorite.place_image_url && (
        <Image source={{ uri: favorite.place_image_url }} style={styles.favoriteImage} />
      )}
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteName}>{favorite.place_name}</Text>
        {favorite.place_description && (
          <Text style={styles.favoriteDescription} numberOfLines={2}>
            {favorite.place_description}
          </Text>
        )}
        {favorite.place_location && (
          <View style={styles.locationContainer}>
            <IconSymbol name="location" color={colors.textSecondary} size={14} />
            <Text style={styles.favoriteLocation}>{favorite.place_location}</Text>
          </View>
        )}
        {favorite.place_category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTag}>{favorite.place_category}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => confirmRemoveFavorite(favorite)}
      >
        <IconSymbol name="heart.fill" color={colors.primary} size={24} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favorite Places',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
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
          {loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading your favorite places...</Text>
            </View>
          ) : favorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="heart" color={colors.textSecondary} size={64} />
              <Text style={styles.emptyTitle}>No Favorite Places Yet</Text>
              <Text style={styles.emptyDescription}>
                Start exploring and add places to your favorites by tapping the heart icon on any location.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/(home)')}
              >
                <Text style={styles.exploreButtonText}>Explore Places</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.favoritesContainer}>
              <Text style={styles.sectionTitle}>
                Your Favorite Places ({favorites.length})
              </Text>
              {favorites.map(renderFavoriteItem)}
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
  favoritesContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  favoriteCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryTag: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: 8,
  },
});
