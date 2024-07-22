import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';

const Index = () => {
  const navigation = useNavigation();
  // Remove header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>#Chat</Text>
        <Text style={styles.subtitle}>
          Empower Your Mind: AI Support for Teens
        </Text>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.image}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/text')}
      >
        <Text style={styles.buttonText}>Get Started with text</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginHorizontal: 'auto',
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Index;
