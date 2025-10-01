
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { UserSettings } from '@/types/DateSuggestion';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to access settings.');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        Alert.alert('Error', 'Failed to load settings.');
      } else if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const defaultSettings = {
          user_id: user.id,
          theme: 'system' as const,
          notifications_enabled: true,
          location_sharing: true,
          preferred_budget: 'moderate' as const,
        };
        
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating settings:', createError);
        } else {
          setSettings(newSettings);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('user_id', settings.user_id);

      if (error) {
        console.error('Error updating setting:', error);
        Alert.alert('Error', 'Failed to update setting.');
      } else {
        setSettings(prev => prev ? { ...prev, [key]: value } : null);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              router.replace('/(tabs)/(home)');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out.');
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    icon: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon as any} color={colors.primary} size={20} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.highlight, true: colors.primary }}
        thumbColor={value ? 'white' : colors.textSecondary}
        disabled={saving}
      />
    </View>
  );

  const renderBudgetOption = (budget: 'budget' | 'moderate' | 'premium', label: string, description: string) => (
    <TouchableOpacity
      key={budget}
      style={[
        styles.budgetOption,
        settings?.preferred_budget === budget && styles.selectedBudgetOption
      ]}
      onPress={() => updateSetting('preferred_budget', budget)}
      disabled={saving}
    >
      <View style={styles.budgetContent}>
        <Text style={[
          styles.budgetLabel,
          settings?.preferred_budget === budget && styles.selectedBudgetLabel
        ]}>
          {label}
        </Text>
        <Text style={[
          styles.budgetDescription,
          settings?.preferred_budget === budget && styles.selectedBudgetDescription
        ]}>
          {description}
        </Text>
      </View>
      {settings?.preferred_budget === budget && (
        <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={20} />
      )}
    </TouchableOpacity>
  );

  const renderThemeOption = (theme: 'light' | 'dark' | 'system', label: string, icon: string) => (
    <TouchableOpacity
      key={theme}
      style={[
        styles.themeOption,
        settings?.theme === theme && styles.selectedThemeOption
      ]}
      onPress={() => updateSetting('theme', theme)}
      disabled={saving}
    >
      <IconSymbol name={icon as any} color={colors.primary} size={20} />
      <Text style={[
        styles.themeLabel,
        settings?.theme === theme && styles.selectedThemeLabel
      ]}>
        {label}
      </Text>
      {settings?.theme === theme && (
        <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={16} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>Choose your preferred theme</Text>
              <View style={styles.themeOptions}>
                {renderThemeOption('light', 'Light', 'sun.max')}
                {renderThemeOption('dark', 'Dark', 'moon')}
                {renderThemeOption('system', 'System', 'gear')}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>Set your default budget preference</Text>
              <View style={styles.budgetOptions}>
                {renderBudgetOption('budget', 'Budget-Friendly', 'Under ₦5,000 per person')}
                {renderBudgetOption('moderate', 'Moderate', '₦5,000 - ₦15,000 per person')}
                {renderBudgetOption('premium', 'Premium', 'Above ₦15,000 per person')}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Notifications</Text>
            <View style={styles.sectionContent}>
              {renderSettingItem(
                'Push Notifications',
                'Receive updates about new places and features',
                'bell',
                settings?.notifications_enabled || false,
                (value) => updateSetting('notifications_enabled', value)
              )}
              {renderSettingItem(
                'Location Sharing',
                'Allow the app to access your location for better recommendations',
                'location',
                settings?.location_sharing || false,
                (value) => updateSetting('location_sharing', value)
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
                <View style={styles.actionIcon}>
                  <IconSymbol name="arrow.right.square" color={colors.primary} size={20} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Sign Out</Text>
                  <Text style={styles.actionDescription}>Sign out of your account</Text>
                </View>
                <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Enugu Date Planner v1.0.0</Text>
            <Text style={styles.footerSubtext}>Made with ❤️ for Enugu</Text>
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
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  selectedThemeOption: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  themeLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  selectedThemeLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  budgetOptions: {
    gap: 8,
  },
  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  selectedBudgetOption: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  budgetContent: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  selectedBudgetLabel: {
    color: colors.primary,
  },
  budgetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedBudgetDescription: {
    color: colors.text,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
