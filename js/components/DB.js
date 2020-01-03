import React, {useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import dbUpgrade from '../dbUpgrade';

// Global DB settings
SQLite.enablePromise(true);

const useDb = () => {
    const [db, setdb] = useState();

    useEffect(() => {
        if( !db ) {
            // Initialise databse
            SQLite.openDatabase({name: 'test.db', createFromLocation: '~faclair-ur.db'})
            .then( async (res) =>  {
                // Perform the necessary schema upgrades
                await doUpgradeDb(res);
                // Create virtual table for full-text searches
                // await initVirtualSearchTable(res);

                // Make the db available to the rest of the application
                setdb(res);
            });
        } 
        // Close database connection when component is unmounted
        return () => db && db.close();
      }, [db]);
    
    return db;
};

/**
 * @param version current db version. Can be 0
 */
const doUpgradeDb = async (db) => {
    const res = await db.executeSql("SELECT MAX(version) FROM Version;", []);
    const version = Object.values(res[0].rows.item(0))[0];

    // targetVersion is latest version of db schema
    if( version == dbUpgrade.targetVersion) return;

    const upgradeVersion = version + 1;

    // Apply version upgrades one at a time (e.g upgrade 1 -> 3 in steps of 1 -> 2 and then 2 -> 3)
    // Call function recursively if user is multiple updates behind targetVersion
    db.sqlBatch([
            ...dbUpgrade.upgradeStatements[`to_v${upgradeVersion}`],
            `INSERT INTO Version (version) VALUES (${upgradeVersion});`            
    ]).then(() => doUpgradeDb({db, version: upgradeVersion}));
};

export default useDb;
