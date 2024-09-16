import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AreaTypeProps = {
  id: string;
  name: string;
};

const Home = () => {
  const [messageTab, setMessageTab] = useState('newMessage');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [allAreas, setAllAreas] = useState<AreaTypeProps[]>([]);
  const [allZones, setAllZones] = useState<AreaTypeProps[]>([]);

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
          // setUsername(data.user.username);
          setCompanyName(data.user.company.name);
          setAllAreas(data.all_areas);
          setAllZones(data.all_zones);
          setCompanyId(data.user.company.id);
          console.log(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onSignOutPress = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.push('/(auth)/sign-in');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAreaSelection = (areaId: string, isSelected: boolean) => {
    setSelectedAreas((prevSelectedAreas) =>
      isSelected
        ? [...prevSelectedAreas, areaId]
        : prevSelectedAreas.filter((a) => a !== areaId)
    );
  };

  const toggleZoneSelection = (zoneId: string, isSelected: boolean) => {
    setSelectedZones((prevSelectedZones) =>
      isSelected
        ? [...prevSelectedZones, zoneId]
        : prevSelectedZones.filter((z) => z !== zoneId)
    );
  };

  const handleSubmit = () => {
    if (selectedAreas.length === 0 && selectedZones.length === 0) {
      Alert.alert(
        'No areas/zones selected',
        'Please select at least one area or zone.'
      );
      return;
    }

    if (message.trim() === '') {
      Alert.alert('No message', 'Please enter a message.');
      return;
    }

    const formData = {
      areas: selectedAreas,
      zones: selectedZones,
      message: message,
      companyId: companyId,
    };

    console.log('Form data:', formData);

    sendMessage(formData);

    Alert.alert(
      'Message Sent',
      `Areas: ${selectedAreas.join(', ')}\nZones: ${selectedZones.join(', ')}\nMessage: ${message}`
    );
  };

  const sendMessage = async (formData: any) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const response = await fetch('http://192.168.0.218:3000/message', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Message sent out successfully');
      } else {
        console.error('Failed to send message');
        Alert.alert('Error', 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'An error occurred while sending the message.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className='flex-1 px-5 justify-center items-center'>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 px-5'>
      <View className='relative w-full'>
        <Text className='text-center text-4xl text-blue-400'>audiebant</Text>
        <Text className='absolute bottom-[15%] right-[23%] text-[9rem] text-blue-400'>
          TM
        </Text>

        <TouchableOpacity
          onPress={onSignOutPress}
          className='absolute right-0 top-[10px]'
        >
          <Image
            source={require('../../assets/icons/logout-icon.png')}
            className='w-5 h-5'
          />
        </TouchableOpacity>
      </View>

      <Text className='text-center text-xl py-2'>{companyName}</Text>

      <View className='w-full h-16 border-blue-400/70 border-[1px] p-[2px] rounded-2xl flex-row'>
        <TouchableOpacity
          className={`w-[50%] flex items-center justify-center rounded-2xl ${
            messageTab === 'newMessage' ? 'bg-blue-400' : ''
          }`}
          onPress={() => {
            setMessageTab('newMessage');
          }}
        >
          <Text
            className={`${
              messageTab === 'newMessage' ? 'text-white' : 'text-black/40'
            } text-xs font-bold `}
          >
            New Live Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-[50%] flex items-center justify-center rounded-2xl ${
            messageTab === 'existingMessage' ? 'bg-blue-400' : ''
          }`}
          onPress={() => {
            setMessageTab('existingMessage');
          }}
        >
          <Text
            className={`${
              messageTab === 'existingMessage' ? 'text-white' : 'text-black/40'
            } text-xs font-bold  `}
          >
            Existing Message
          </Text>
        </TouchableOpacity>
      </View>

      <View className='bg-blue-400 my-4 w-full h-[1px]' />

      {/* Areas and Zones Checkboxes */}
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View>
          <Text className='text-lg font-semibold mb-2'>Select Areas:</Text>
          <View className='flex flex-wrap flex-row'>
            {allAreas.map((area) => (
              <View
                key={area.id}
                className='flex-row items-center w-[45%] mb-2 mr-4'
              >
                <Checkbox
                  value={selectedAreas.includes(area.id)}
                  onValueChange={(newValue) =>
                    toggleAreaSelection(area.id, newValue)
                  }
                  color={
                    selectedAreas.includes(area.id) ? '#4630EB' : undefined
                  }
                  className='mr-2'
                />
                <Text className='text-base'>{area.name}</Text>
              </View>
            ))}
          </View>

          <Text className='text-lg font-semibold mt-4 mb-2'>Select Zones:</Text>
          <View className='flex flex-wrap flex-row'>
            {allZones.map((zone) => (
              <View
                key={zone.id}
                className='flex-row items-center w-[45%] mb-2 mr-4'
              >
                <Checkbox
                  value={selectedZones.includes(zone.id)}
                  onValueChange={(newValue) =>
                    toggleZoneSelection(zone.id, newValue)
                  }
                  color={
                    selectedZones.includes(zone.id) ? '#4630EB' : undefined
                  }
                  className='mr-2'
                />
                <Text className='text-base'>{zone.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Message */}
      <TextInput
        className='border border-gray-300 p-3 rounded-md mt-4 mb-6'
        placeholder='Enter your message'
        value={message}
        onChangeText={setMessage}
      />

      {/* Submit */}
      <TouchableOpacity
        className='bg-blue-400 p-4 rounded-md items-center'
        onPress={handleSubmit}
      >
        <Text className='text-white text-lg font-bold'>Send Message</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
