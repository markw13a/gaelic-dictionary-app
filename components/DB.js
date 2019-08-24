import React, {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

// Global DB settings
SQLite.enablePromise(true);

const DictionaryDBConnection = ({db, setdb}) => {
    useEffect(() => {
        // Initialise databse
        if( !db ) {
            SQLite.openDatabase({name : 'test.db', createFromLocation: '~faclair.db'})
            .then(res => {
                // TODO: this is a crude way of ensuring that database has this column
                // Look in to alternative that doesn't need to be run every time the app is loaded
                res.executeSql(
                    "ALTER TABLE faclair ADD COLUMN favourited int DEFAULT 0;", 
                    []
                );
                // TODO: need to have some way of clearing out search data
                // Can maybe add a "delete history" button or just clear entries older than a certain age? Deleting oldest entries once a certain limit is reached is also an option
                res.executeSql(
                    "CREATE TABLE IF NOT EXISTS History("
                    + " id INTEGER PRIMARY KEY NOT NULL,"
                    + " gaelic TEXT NOT NULL,"
                    + " english TEXT NOT NULL,"
                    + " date DATE NOT NULL);", 
                    []
                );
                // Feel that db file used is not very complete. Want the user to be able to add their own words and phrases to the favourites list
                res.executeSql(
                    "CREATE TABLE IF NOT EXISTS UserCreatedTerms("
                    + " id INTEGER PRIMARY KEY NOT NULL,"
                    + " gaelic TEXT NOT NULL,"
                    + " english TEXT NOT NULL);", 
                    []
                );
                setdb(res);
            });
        }
    
        // Close database connection when component is unmounted
        return () => db.close();
      }, []);
    
    return null;
};

export default DictionaryDBConnection;
