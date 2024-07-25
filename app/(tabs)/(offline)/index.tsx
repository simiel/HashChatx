// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
// import data from '../../../assets/fulldata.json';
import { useRouter } from 'expo-router';

interface dataType {
  TOPIC: string;
  SUBTOPIC: string;
  DESCRIPTION: string;
  LINK: string;
}

const data: dataType[] = require('../../../assets/fulldata.json');

export default function HomeScreen() {
  const router = useRouter();
  //   console.log(data);
  const topics = [...new Set(data.map((item) => item.TOPIC))];

  return (
    <ScrollView>
      <View style={styles.container}>
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicButton}
            onPress={() => router.push('subtopic/' + topic)}
          >
            <Text style={styles.topicText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  topicButton: {
    padding: 20,
    margin: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  topicText: {
    color: '#fff',
    fontSize: 18,
  },
});
