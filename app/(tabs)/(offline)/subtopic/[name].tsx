// screens/SubtopicsScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
// import data from '../../../../assets/fulldata.json';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

interface dataType {
  TOPIC: string;
  SUBTOPIC: string;
  DESCRIPTION: string;
  LINK: string;
}

const data: dataType[] = require('../../../../assets/fulldata.json');

export default function SubtopicsScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const subtopics = [
    ...new Set(
      data.filter((item) => item.TOPIC === name).map((item) => item.SUBTOPIC)
    ),
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>{name}</Text>
        {subtopics.map((subtopic, index) => (
          <Link
            href={{
              pathname: '/QA',
              params: { topic: name, subtopic: subtopic },
            }}
            asChild
          >
            <TouchableOpacity key={index} style={styles.subtopicButton}>
              <Text style={styles.subtopicText}>{subtopic}</Text>
            </TouchableOpacity>
          </Link>
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
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtopicButton: {
    padding: 20,
    margin: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  subtopicText: {
    color: '#fff',
    fontSize: 18,
  },
});
