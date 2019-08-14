/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import DBConnection from './components/DB';
// import SearchBar from './components/SearchBar';
// import SearchResult from './components/SearchResult';

const Main = () => {
  // Store SQLite dictionary db in state
  // Managed via DBConnection component
  const [db, setdb] = useState();

  const [results, setResults] = useState();
  useEffect(() => {
    if(db) {
      db.executeSql("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';", [])
      .then((res) => console.warn(res));
    }
  }, [db]);

  return (
    <>
      {/* <DBConnection db={db} setdb={setdb} /> */}
      <View style={styles.container}>
        <Text style={styles.welcome}> Welcome to React Native! </Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text> {results + ''} </Text>
      </View>
    </>
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
