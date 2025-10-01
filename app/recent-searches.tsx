
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { RecentSearch, UserPreferences } from '@/types/DateSuggestion';
import { getRecommendations } from '@/utils/recommendationEngine';

export default function RecentSearchesScreen() {
  const router = useRouter();
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to view your recent searches.');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('recent_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading recent searches:', error);
        Alert.alert('Error', 'Failed to load recent searches.');
      } else {
        setSearches(data || []);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
      Alert.alert('Error', 'Failed to load recent searches.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase
        .from('recent_searches')
        .delete()
        .eq('id', searchId);

      if (error) {
        console.error('Error deleting search:', error);
        Alert.alert('Error', 'Failed to delete search.');
      } else {
        setSearches(prev => prev.filter(search => search.id !== searchId));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
      Alert.alert('Error', 'Failed to delete search.');
    }
  };

  const clearAllSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('recent_searches')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing searches:', error);
        Alert.alert('Error', 'Failed to clear searches.');
      } else {
        setSearches([]);
        Alert.alert('Success', 'All searches cleared successfully.');
      }
    } catch (error) {
      console.error('Error clearing searches:', error);
      Alert.alert('Error', 'Failed to clear searches.');
    }
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Clear All Searches',
      'Are you sure you want to clear all your recent searches? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllSearches },
      ]
    );
  };

  const repeatSearch = (searchQuery: UserPreferences) => {
    console.log('Repeating search with preferences:', searchQuery);
    // Navigate back to home with the search preferences
    router.push({
      pathname: '/(tabs)/(home)',
      params: {
        budget: searchQuery.budget,
        location: searchQuery.location,
        style: searchQuery.style,
        groupSize: searchQuery.groupSize.toString(),
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBudgetIcon = (budget: string) => {
    switch (budget) {
      case 'budget': return 'dollarsign.circle';
      case 'moderate': return 'dollarsign.circle.fill';
      case 'premium': return 'star.circle.fill';
      default: return 'dollarsign.circle';
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'romantic': return 'heart.fill';
      case 'adventure': return 'mountain.2.fill';
      case 'cultural': return 'building.columns.fill';
      case 'relaxing': return 'leaf.fill';
      case 'food': return 'fork.knife';
      case 'outdoor': return 'tree.fill';
      default: return 'star.fill';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecentSearches();
  };

  const renderSearchItem = (search: RecentSearch) => {
    const query = search.search_query as UserPreferences;
    
    return (
      <View key={search.id} style={styles.searchCard}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInfo}>
            <View style={styles.searchCriteria}>
              <View style={styles.criteriaItem}>
                <IconSymbol 
                  name={getBudgetIcon(query.budget)} 
                  color={colors.primary} 
                  size={16} 
                />
                <Text style={styles.criteriaText}>{query.budget}</Text>
              </View>
              <View style={styles.criteriaItem}>
                <IconSymbol 
                  name={getStyleIcon(query.style)} 
                  color={colors.secondary} 
                  size={16} 
                />
                <Text style={styles.criteriaText}>{query.style}</Text>
              </View>
              <View style={styles.criteriaItem}>
                <IconSymbol name="location" color={colors.accent} size={16} />
                <Text style={styles.criteriaText}>{query.location}</Text>
              </View>
            </View>
            <Text style={styles.searchDate}>{formatDate(search.created_at)}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteSearch(search.id)}
          >
            <IconSymbol name="trash" color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() => repeatSearch(query)}
          >
            <IconSymbol name="arrow.clockwise" color={colors.primary} size={16} />
            <Text style={styles.repeatButtonText}>Search Again</Text>
          </TouchableOpacity>
          
          <Text style={styles.groupSizeText}>
            Group Size: {query.groupSize} {query.groupSize === 1 ? 'person' : 'people'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recent Searches',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
            </TouchableOpacity>
          ),
          headerRight: searches.length > 0 ? () => (
            <TouchableOpacity onPress={confirmClearAll} style={styles.headerButton}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          ) : undefined,
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
              <Text style={styles.loadingText}>Loading your recent searches...</Text>
            </View>
          ) : searches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="clock" color={colors.textSecondary} size={64} />
              <Text style={styles.emptyTitle}>No Recent Searches</Text>
              <Text style={styles.emptyDescription}>
                Your search history will appear here after you start exploring date suggestions.
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/(home)')}
              >
                <Text style={styles.exploreButtonText}>Start Exploring</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.searchesContainer}>
              <Text style={styles.sectionTitle}>
                Recent Searches ({searches.length})
              </Text>
              {searches.map(renderSearchItem)}
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
  clearAllText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
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
  searchesContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  searchCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  searchInfo: {
    flex: 1,
  },
  searchCriteria: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  criteriaText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  searchDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  repeatButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  groupSizeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
