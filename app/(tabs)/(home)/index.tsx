
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform 
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { UserPreferences } from '@/types/DateSuggestion';
import { enuguAreas } from '@/data/dateLocations';
import { getRecommendations } from '@/utils/recommendationEngine';
import RecommendationsList from '@/components/RecommendationsList';

export default function HomeScreen() {
  const params = useLocalSearchParams();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 'moderate',
    location: 'any',
    style: 'romantic',
    groupSize: 2
  });
  
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Check if we have search parameters from recent searches
    if (params.budget || params.location || params.style || params.groupSize) {
      const newPreferences: UserPreferences = {
        budget: (params.budget as any) || preferences.budget,
        location: (params.location as string) || preferences.location,
        style: (params.style as any) || preferences.style,
        groupSize: params.groupSize ? parseInt(params.groupSize as string) : preferences.groupSize,
      };
      
      setPreferences(newPreferences);
      
      // Automatically get recommendations
      const results = getRecommendations(newPreferences);
      setRecommendations(results);
      setShowRecommendations(true);
    }
  }, [params]);

  const budgetOptions = [
    { key: 'budget', label: 'Budget Friendly', subtitle: '₦500 - ₦3,000', icon: 'banknote' },
    { key: 'moderate', label: 'Moderate', subtitle: '₦3,000 - ₦10,000', icon: 'creditcard' },
    { key: 'premium', label: 'Premium', subtitle: '₦10,000+', icon: 'diamond' }
  ];

  const styleOptions = [
    { key: 'romantic', label: 'Romantic', subtitle: 'Intimate & cozy', icon: 'heart.fill' },
    { key: 'adventure', label: 'Adventure', subtitle: 'Exciting & active', icon: 'mountain.2' },
    { key: 'cultural', label: 'Cultural', subtitle: 'Educational & historic', icon: 'building.columns' },
    { key: 'relaxing', label: 'Relaxing', subtitle: 'Peaceful & calm', icon: 'leaf' },
    { key: 'food', label: 'Food & Dining', subtitle: 'Culinary experiences', icon: 'fork.knife' },
    { key: 'outdoor', label: 'Outdoor', subtitle: 'Nature & fresh air', icon: 'tree' }
  ];

  const locationOptions = [
    { key: 'any', label: 'Any Location', subtitle: 'Show all areas' },
    ...enuguAreas.map(area => ({
      key: area.name,
      label: area.name,
      subtitle: area.description
    }))
  ];

  const handleGetRecommendations = () => {
    console.log('Getting recommendations with preferences:', preferences);
    const results = getRecommendations(preferences);
    setRecommendations(results);
    setShowRecommendations(true);
  };

  const handleBackToForm = () => {
    setShowRecommendations(false);
  };

  if (showRecommendations) {
    return (
      <>
        {Platform.OS === 'ios' && (
          <Stack.Screen
            options={{
              title: "Date Suggestions",
              headerLeft: () => (
                <TouchableOpacity onPress={handleBackToForm} style={styles.headerButton}>
                  <IconSymbol name="chevron.left" color={colors.primary} size={20} />
                </TouchableOpacity>
              ),
            }}
          />
        )}
        <RecommendationsList 
          recommendations={recommendations} 
          preferences={preferences}
          onBack={handleBackToForm}
        />
      </>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Enugu Date Planner",
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => Alert.alert("Info", "Find perfect date spots in Enugu metropolis!")}
                style={styles.headerButton}
              >
                <IconSymbol name="info.circle" color={colors.primary} size={20} />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <ScrollView style={[commonStyles.wrapper]} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Find Your Perfect Date Spot</Text>
          <Text style={commonStyles.textSecondary}>
            Discover amazing places for couples and friends in Enugu metropolis
          </Text>
        </View>

        {/* Budget Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What&apos;s your budget?</Text>
          <View style={styles.optionsContainer}>
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  preferences.budget === option.key && styles.selectedCard
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, budget: option.key as any }))}
              >
                <View style={styles.optionIcon}>
                  <IconSymbol 
                    name={option.icon as any} 
                    color={preferences.budget === option.key ? colors.primary : colors.textSecondary} 
                    size={24} 
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    preferences.budget === option.key && styles.selectedText
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Style Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What style do you prefer?</Text>
          <View style={styles.optionsContainer}>
            {styleOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  preferences.style === option.key && styles.selectedCard
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, style: option.key as any }))}
              >
                <View style={styles.optionIcon}>
                  <IconSymbol 
                    name={option.icon as any} 
                    color={preferences.style === option.key ? colors.primary : colors.textSecondary} 
                    size={24} 
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    preferences.style === option.key && styles.selectedText
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred location in Enugu?</Text>
          <View style={styles.optionsContainer}>
            {locationOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  preferences.location === option.key && styles.selectedCard
                ]}
                onPress={() => setPreferences(prev => ({ ...prev, location: option.key }))}
              >
                <View style={styles.optionIcon}>
                  <IconSymbol 
                    name="location" 
                    color={preferences.location === option.key ? colors.primary : colors.textSecondary} 
                    size={24} 
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    preferences.location === option.key && styles.selectedText
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Get Recommendations Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.recommendButton}
            onPress={handleGetRecommendations}
          >
            <IconSymbol name="sparkles" color="white" size={20} />
            <Text style={styles.recommendButtonText}>Get Recommendations</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 20, // Extra padding for floating tab bar on Android
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedText: {
    color: colors.primary,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  recommendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recommendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
});
