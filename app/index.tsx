import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in AsyncStorage (or SecureStore for more security)
        const token = await AsyncStorage.getItem('token'); // Replace 'token' with your key

        if (token) {
          // If token exists, verify it
          const isValid = await verifyToken(token); // Verify token with the server
          setIsAuthenticated(isValid);
        } else {
          setIsAuthenticated(false); // No token means not authenticated
        }
      } catch (error) {
        console.error('Error checking authentication status', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // End loading after check is complete
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking authentication
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  if (isAuthenticated === false) {
    // Redirect to the welcome screen if not authenticated
    return <Redirect href='/(auth)/welcome' />;
    // return <Redirect href='/home' />;
  }

  // Redirect to the home screen if authenticated
  return <Redirect href='/home' />;
};

export default Home;

// Example of token verification with server endpoint
const verifyToken = async (token: string) => {
  try {
    const response = await fetch('http://localhost:3000/verify-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return response.ok && data.valid; // Return true if token is valid
  } catch (error) {
    console.error('Error verifying token:', error);
    return false; // Invalid token or error occurred
  }
};
