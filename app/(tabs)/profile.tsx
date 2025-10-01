
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturePress = (feature: string) => {
    console.log('Feature pressed:', feature);
    
    // Features that require authentication
    const authRequiredFeatures = ['Favorite Places', 'Recent Searches', 'Rate & Review', 'Settings'];
    
    if (authRequiredFeatures.includes(feature) && !user) {
      Alert.alert(
        'Sign In Required',
        `Please sign in to access ${feature}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth') },
        ]
      );
      return;
    }
    
    switch (feature) {
      case 'Favorite Places':
        router.push('/favorite-places');
        break;
      case 'Recent Searches':
        router.push('/recent-searches');
        break;
      case 'Rate & Review':
        router.push('/rate-review');
        break;
      case 'Share with Friends':
        handleShareApp();
        break;
      case 'Settings':
        router.push('/settings');
        break;
      case 'Help & Support':
        router.push('/help-support');
        break;
      default:
        Alert.alert("Coming Soon", `${feature} feature will be available in a future update!`);
    }
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out Enugu Date Planner! 🌟 Discover amazing places for dates and hangouts in Enugu metropolis. Perfect for couples and friends looking for romantic spots, adventures, cultural experiences, and great food! Download now and explore Enugu like never before! 💕',
        title: 'Enugu Date Planner - Discover Amazing Places',
      });
      
      if (result.action === Share.sharedAction) {
        console.log('App shared successfully');
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Error', 'Unable to share the app. Please try again.');
    }
  };

  const profileFeatures = [
    {
      icon: 'heart.fill',
      title: 'Favorite Places',
      description: 'Save your favorite date spots',
      color: colors.primary,
    },
    {
      icon: 'clock.fill',
      title: 'Recent Searches',
      description: 'View your recent recommendations',
      color: colors.secondary,
    },
    {
      icon: 'star.fill',
      title: 'Rate & Review',
      description: 'Share your experiences',
      color: colors.accent,
    },
    {
      icon: 'person.2.fill',
      title: 'Share with Friends',
      description: 'Invite friends to discover Enugu',
      color: colors.primary,
    },
    {
      icon: 'gear',
      title: 'Settings',
      description: 'Customize your preferences',
      color: colors.textSecondary,
    },
    {
      icon: 'questionmark.circle.fill',
      title: 'Help & Support',
      description: 'Get help and contact us',
      color: colors.secondary,
    },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Profile",
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => handleFeaturePress("Settings")}
                style={styles.headerButton}
              >
                <IconSymbol name="gear" color={colors.primary} size={20} />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentAndroid
          ]}
          showsVerticalScrollIndicator={false}
        >
          {Platform.OS !== 'ios' && (
            <View style={styles.androidHeader}>
              <Text style={styles.androidHeaderTitle}>Profile</Text>
              <TouchableOpacity 
                onPress={() => handleFeaturePress("Settings")}
                style={styles.headerButton}
              >
                <IconSymbol name="gear" color={colors.primary} size={24} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.fill" color="white" size={40} />
            </View>
            {user ? (
              <>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.subtitle}>
                  Explore your saved places and discover new ones
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={styles.appName}>Enugu Date Planner</Text>
                <Text style={styles.subtitle}>
                  Discover amazing places for couples and friends in Enugu metropolis
                </Text>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => router.push('/auth')}
                >
                  <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.featuresContainer}>
            {profileFeatures.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCard}
                onPress={() => handleFeaturePress(feature.title)}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <IconSymbol name={feature.icon as any} color="white" size={24} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About This App</Text>
            <Text style={styles.aboutText}>
              Enugu Date Planner helps you discover the perfect spots for romantic dates, 
              adventurous outings, cultural experiences, and relaxing moments in Enugu metropolis. 
              Whether you&apos;re planning a special date or just want to explore the city with friends, 
              we&apos;ve got you covered!
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ for Enugu</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  androidHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContentAndroid: {
    paddingBottom: 100, // Extra padding for floating tab bar
    paddingTop: 0,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
