import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // useEffect(() => {
  //   const checkOnboardingStatus = async () => {
  //     const onboardingStatus = await AsyncStorage.getItem(
  //       'onboardingCompleted'
  //     );
  //     if (onboardingStatus) {
  //       setIsOnboardingCompleted(true);
  //     }
  //   };

  //   checkOnboardingStatus();
  // }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      {/* <Stack.Screen name='text' options={{ headerShown: true }} /> */}
      {/* <Stack.Screen name='+not-found' /> */}
    </Stack>
  );
}
