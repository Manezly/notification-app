import { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/text-input';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const onSignInPress = async () => {
    // console.log(form);
    try {
      const res = await fetch('http://192.168.0.218:3000/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        return new Error('Error sending form data');
      }
      const data = await res.json();

      if (data.token) {
        console.log('Login success:', data.message);
        console.log('Token receieved:', data.token);
      }

      await AsyncStorage.setItem('authToken', data.token);

      router.push('/(tabs)/home');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView>
        <Text className='text-3xl text-center'>Sign in</Text>

        <View className='p-5'>
          <InputField
            label='Username'
            value={form.username}
            placeholder='Enter username'
            onChangeText={(value) => {
              setForm({ ...form, username: value });
            }}
          />
          <InputField
            label='Password'
            value={form.password}
            placeholder='Enter password'
            secureTextEntry={true}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
            }}
          />
          <TouchableOpacity onPress={onSignInPress}>
            <Text>Sign in</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback
            onPress={() => {
              router.push('/(auth)/sign-up');
            }}
          >
            <Text>No account?</Text>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
