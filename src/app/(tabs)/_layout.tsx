import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { C } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: C.bg },
        headerTintColor: C.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.border },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.faint,
        sceneStyle: { backgroundColor: C.bg },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Power Stack',
          tabBarLabel: 'Agents',
          tabBarIcon: ({ color, size }) => <Ionicons name="flash-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Business',
          tabBarLabel: 'Business',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
