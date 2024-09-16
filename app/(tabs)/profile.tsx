import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/text-input';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('No auth token found');
          return;
        }

        const response = await fetch('http://192.168.0.218:3000/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Access the user object and set the state
          setUsername(data.user.username);
          setCompanyName(data.user.company.name);
          console.log(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className='px-5 flex flex-col flex-1'>
        <View className='relative w-full'>
          <Text className='text-center text-4xl text-blue-400'>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='px-5 flex flex-col flex-1'>
      <View className='relative w-full'>
        <Text className='text-center text-4xl text-blue-400'>Your Profile</Text>
      </View>
      <ScrollView className='flex-1'>
        <InputField
          label='Username'
          value={username}
          inputStyle='border-[1px] border-black/40'
          // Uncomment if you want to allow editing
          // onChangeText={(value) => setUsername(value)}
        />
        <InputField
          label='Company Name'
          value={companyName}
          inputStyle='border-[1px] border-black/40'
          // Uncomment if you want to allow editing
          // onChangeText={(value) => setCompanyName(value)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
