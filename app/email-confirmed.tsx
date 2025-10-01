
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function EmailConfirmedScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    checkConfirmation();
  }, []);

  const checkConfirmation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User confirmation status:', user);
      
      if (user && user.email_confirmed_at) {
        setConfirmed(true);
        Alert.alert(
          'Email Confirmed!',
          'Your email has been successfully confirmed. You can now sign in to your account.',
          [
            { text: 'OK', onPress: () => router.replace('/auth') }
          ]
        );
      } else {
        Alert.alert(
          'Confirmation Pending',
          'Please check your email and click the confirmation link to verify your account.',
          [
            { text: 'OK', onPress: () => router.replace('/auth') }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking confirmation:', error);
      Alert.alert(
        'Error',
        'Unable to verify confirmation status. Please try signing in.',
        [
          { text: 'OK', onPress: () => router.replace('/auth') }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Email Confirmation',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/auth')} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol 
                name={confirmed ? "checkmark.circle.fill" : "envelope.fill"} 
                color={confirmed ? colors.accent : colors.primary} 
                size={64} 
              />
            </View>
            
            <Text style={styles.title}>
              {loading ? 'Checking...' : confirmed ? 'Email Confirmed!' : 'Check Your Email'}
            </Text>
            
            <Text style={styles.message}>
              {loading 
                ? 'Verifying your email confirmation...'
                : confirmed 
                  ? 'Your email has been successfully confirmed. You can now sign in to your account.'
                  : 'Please check your email and click the confirmation link to verify your account.'
              }
            </Text>

            {!loading && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/auth')}
              >
                <Text style={styles.buttonText}>
                  {confirmed ? 'Sign In Now' : 'Back to Sign In'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
