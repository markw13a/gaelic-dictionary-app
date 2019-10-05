import React, {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
import dbUpgrade from '../dbUpgrade';

// Global DB settings
SQLite.enablePromise(true);

const DictionaryDBConnection = ({db, setdb}) => {
    useEffect(() => {
        if( !db ) {
            // Initialise databse
            SQLite.openDatabase({name : 'test.db', createFromLocation: '~faclair.db'})
            .then(res => setdb(res));
        } else {
            // Check for updates to databse schema
            db.executeSql(
                "SELECT MAX(version) FROM Version;"
                , []
            ).then( res => {
                const version = Object.values(res[0].rows.item(0))[0];

                // Perform the necessary schema upgrades
                doUpgradeDb({db, version});
            }).catch( err => {
                // User has old database that did not track version number
                if(err.message && err.message.includes("no such table")) {
                    doUpgradeDb({db, version: 0});
                } else {
                    console.error(err);
                }
            }); 
        }

        // Close database connection when component is unmounted
        return () => db && db.close();
      }, [db]);
    
    return null;
};

/**
 * @param version current db version. Can be 0
 */
const doUpgradeDb = ({db, version}) => {
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

export default DictionaryDBConnection;
