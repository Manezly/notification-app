import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='home' options={{ title: 'Home' }} />
      <Tabs.Screen name='profile' options={{ title: 'Profile' }} />
      <Tabs.Screen name='settings' options={{ title: 'Settings' }} />
    </Tabs>
  );
}
