import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInputProps,
} from 'react-native';

type InputFieldProps = TextInputProps & {
  label: string;
  secureTextEntry?: boolean;
  inputStyle?: string;
};

export default function InputField({
  label,
  secureTextEntry = false,
  inputStyle,
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text className='py-2'>{label}</Text>
          <TextInput
            className={`rounded-full p-4 flex-1 text-left ${inputStyle}`}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
