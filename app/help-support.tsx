
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I find date suggestions?',
      answer: 'Go to the Home tab, select your budget, preferred location, and style preferences. The app will suggest perfect places for your date or hangout in Enugu metropolis.',
    },
    {
      id: '2',
      question: 'How do I save favorite places?',
      answer: 'When viewing recommendations, tap the heart icon on any place to add it to your favorites. You can view all your saved places in the Favorite Places section of your profile.',
    },
    {
      id: '3',
      question: 'Can I review places I\'ve visited?',
      answer: 'Yes! Go to the Rate & Review section in your profile to share your experiences and rate places you\'ve visited. This helps other users make better choices.',
    },
    {
      id: '4',
      question: 'How accurate are the estimated costs?',
      answer: 'Our cost estimates are based on average prices and may vary depending on specific choices, group size, and current market rates. We recommend checking with venues directly for exact pricing.',
    },
    {
      id: '5',
      question: 'Are the locations real places in Enugu?',
      answer: 'Yes, all locations featured in the app are real places in Enugu metropolis. We regularly update our database to ensure accuracy and add new exciting locations.',
    },
    {
      id: '6',
      question: 'How do I share the app with friends?',
      answer: 'Use the "Share with Friends" option in your profile to send a message about the app to your contacts via your preferred messaging or social media apps.',
    },
    {
      id: '7',
      question: 'Can I use the app without creating an account?',
      answer: 'You can browse recommendations without an account, but creating one allows you to save favorites, write reviews, and access your search history.',
    },
    {
      id: '8',
      question: 'How often is the app updated?',
      answer: 'We regularly update the app with new locations, features, and improvements. Make sure to keep your app updated for the best experience.',
    },
  ];

  const contactOptions = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email for detailed inquiries',
      icon: 'envelope',
      action: () => Linking.openURL('mailto:support@enugudateplanner.com?subject=Support Request'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      icon: 'message',
      action: () => Linking.openURL('https://wa.me/2348000000000?text=Hello, I need help with Enugu Date Planner'),
    },
    {
      id: 'website',
      title: 'Visit Website',
      description: 'More information and resources',
      icon: 'globe',
      action: () => Linking.openURL('https://enugudateplanner.com'),
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Missing Feedback', 'Please enter your feedback before submitting.');
      return;
    }

    // In a real app, you would send this to your backend
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! We appreciate your input and will use it to improve the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFeedbackText('');
            setShowFeedbackForm(false);
          },
        },
      ]
    );
  };

  const renderFAQItem = (item: FAQItem) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFAQ(item.id)}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <IconSymbol
          name={expandedFAQ === item.id ? 'chevron.up' : 'chevron.down'}
          color={colors.primary}
          size={16}
        />
      </TouchableOpacity>
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  const renderContactOption = (option: typeof contactOptions[0]) => (
    <TouchableOpacity
      key={option.id}
      style={styles.contactOption}
      onPress={option.action}
    >
      <View style={styles.contactIcon}>
        <IconSymbol name={option.icon as any} color={colors.primary} size={20} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactDescription}>{option.description}</Text>
      </View>
      <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Help & Support',
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
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.sectionContent}>
              {faqItems.map(renderFAQItem)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Need more help? Get in touch with our support team.
              </Text>
              {contactOptions.map(renderContactOption)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send Feedback</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Help us improve the app by sharing your thoughts and suggestions.
              </Text>
              
              {!showFeedbackForm ? (
                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={() => setShowFeedbackForm(true)}
                >
                  <IconSymbol name="pencil" color={colors.primary} size={16} />
                  <Text style={styles.feedbackButtonText}>Write Feedback</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.feedbackForm}>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    placeholderTextColor={colors.textSecondary}
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  <View style={styles.feedbackActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setShowFeedbackForm(false);
                        setFeedbackText('');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={submitFeedback}
                    >
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            <View style={styles.sectionContent}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Developer</Text>
                <Text style={styles.infoValue}>Enugu Date Planner Team</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Platform</Text>
                <Text style={styles.infoValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Thank you for using Enugu Date Planner! 🌟
            </Text>
            <Text style={styles.footerSubtext}>
              Made with ❤️ for couples and friends in Enugu
            </Text>
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
    lineHeight: 20,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
    paddingVertical: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  feedbackButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  feedbackForm: {
    gap: 16,
  },
  feedbackInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.highlight,
    minHeight: 120,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: 12,
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
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
