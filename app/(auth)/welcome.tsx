import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = () => {
  return (
    <SafeAreaView className='w-full h-full justify-center items-center p-6'>
      <View className='mb-6'>
        <Text className='text-2xl text-center'>
          Welcome to the <Text className='text-blue-400'>audiebant</Text> Urgent
          Notifications app.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.replace('/(auth)/sign-in');
        }}
        className='px-5 py-3 bg-blue-400 flex rounded-xl'
      >
        <Text className='text-white'>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.replace('/(auth)/sign-up');
        }}
        className='px-5 py-3 bg-blue-400 flex rounded-xl'
      >
        <Text className='text-white'>Create an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcome;
