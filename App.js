/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// import SearchBar from './components/SearchBar';
// import SearchResult from './components/SearchResult';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const Main = () => {
  const [db, setdb] = useState();
  useEffect(() => {
    SQLite.enablePromise(true);
    SQLite.openDatabase({name : 'faclair.db'})
    .then(res => setdb(res));
  }, []);

  const [results, setResults] = useState();
  useEffect(() => {
    if(db) {
      db.executeSql("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';", [])
      .then((res) => console.warn(res));
    }
  }, [db]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}> Welcome to React Native! </Text>
      <Text style={styles.instructions}>To get started, edit App.js</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <Text> {results + ''} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Main;
