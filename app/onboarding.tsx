// screens/OnboardingScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const OnboardingScreen = ({ navigation }: any) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // console.log(data);
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      router.replace('/text');
    } catch (e) {
      console.error('Failed to save onboarding data to local storage', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Age</Text>
      <Controller
        control={control}
        name='age'
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder='Enter your age'
            keyboardType='numeric'
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>Disability</Text>
      <Controller
        control={control}
        name='disability'
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
          >
            <Picker.Item label='Select Disability' value='' />
            <Picker.Item label='None' value='none' />
            <Picker.Item label='Visual' value='visual' />
            <Picker.Item label='Hearing' value='hearing' />
          </Picker>
        )}
      />

      <Text style={styles.label}>Gender</Text>
      <Controller
        control={control}
        name='gender'
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
          >
            <Picker.Item label='Select Gender' value='' />
            <Picker.Item label='Male' value='male' />
            <Picker.Item label='Female' value='female' />
          </Picker>
        )}
      />

      <Button title='Submit' onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});

export default OnboardingScreen;
