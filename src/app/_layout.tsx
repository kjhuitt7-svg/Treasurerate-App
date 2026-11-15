import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { C } from '@/constants/theme';
import { StoreProvider, useStore } from '@/lib/store';
import { WalletProvider } from '@/lib/wallet';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: C.bg, card: C.bg, text: C.text, border: C.border, primary: C.gold },
};

function Root() {
  const { ready } = useStore();
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.bg },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: C.bg },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Agents' }} />
      <Stack.Screen name="agent/[id]" options={{ title: '', headerBackButtonDisplayMode: 'minimal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal', title: 'Unlock every agent' }} />
      <Stack.Screen name="consent" options={{ presentation: 'modal', title: 'Before your first run' }} />
      <Stack.Screen name="legal/[doc]" options={{ title: '', headerBackButtonDisplayMode: 'minimal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <StoreProvider>
        <WalletProvider>
          <StatusBar style="light" />
          <Root />
        </WalletProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
