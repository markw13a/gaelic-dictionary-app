import React, {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

// Global DB settings
SQLite.enablePromise(true);

// Dummy component that handles entire life-cycle of opening/closing database
const DBConnection = ({db, setdb}) => {
    useEffect(() => {
        // Initialise databse
        if( !db ) {
            SQLite.openDatabase({name : 'faclair.db'})
            .then(res => setdb(res));
        }
    
        // Close database connection when component is unmounted
        return () => db.close();
      }, []);
    
    return;
};

export default DBConnection;
