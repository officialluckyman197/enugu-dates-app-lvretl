
import { useTheme } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const animatedValue = useSharedValue(0);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      [0, 1],
      [0, containerWidth / tabs.length]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    const tabIndex = tabs.findIndex(tab => tab.route === route);
    if (tabIndex !== -1) {
      animatedValue.value = withSpring(tabIndex);
    }
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.container, { bottom: bottomMargin }]}>
        <BlurView
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius,
            },
            Platform.OS !== 'ios' && {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.highlight,
            }
          ]}
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
        >
          <Animated.View
            style={[
              styles.indicator,
              {
                width: containerWidth / tabs.length,
                borderRadius: borderRadius - 4,
                backgroundColor: colors.primary,
              },
              animatedStyle,
            ]}
          />
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.name);
            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, { width: containerWidth / tabs.length }]}
                onPress={() => handleTabPress(tab.route)}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? 'white' : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? 'white' : colors.text,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    height: 52,
    top: 4,
    left: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
