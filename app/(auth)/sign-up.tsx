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

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const onSignUpPress = async () => {
    console.log(form);
    try {
      const res = await fetch('http://192.168.0.218:3000/signUp', {
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
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView>
        <Text className='text-3xl text-center'>Sign Up</Text>

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
          <TouchableOpacity onPress={onSignUpPress}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback
            onPress={() => {
              router.push('/(auth)/sign-in');
            }}
          >
            <Text>Have an account?</Text>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
