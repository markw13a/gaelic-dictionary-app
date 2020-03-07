import React, {useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import dbUpgrade from './dbUpgrade';

// Global DB settings
SQLite.enablePromise(true);

/**
 * @param version current db version. Can be 0
 */
const doUpgradeDb = async (db) => {
    const res = await db.executeSql("SELECT MAX(version) FROM Version;", []);
    const version = Object.values(res[0].rows.item(0))[0];

    if( version == dbUpgrade.targetVersion ) return;

    const upgradeVersion = version + 1;

    // Apply version upgrades one at a time (e.g upgrade 1 -> 3 in steps of 1 -> 2 and then 2 -> 3)
    // Call function recursively if user is multiple updates behind targetVersion
    db.sqlBatch([
            ...dbUpgrade.upgradeStatements[`to_v${upgradeVersion}`],
            `INSERT INTO Version (version) VALUES (${upgradeVersion});`            
    ]).then(() => doUpgradeDb({db, version: upgradeVersion}));
};

const DbContext = React.createContext();

const useDb = () => {
    const db = React.useContext(DbContext);
	return db;
};
const DbProvider = ({children}) => {
    const [db, setdb] = useState();
    useEffect(() => {
        if( !db ) {
            // Initialise databse
            SQLite.openDatabase({name: 'test.db', createFromLocation: '~faclair-ur.db'})
            .then( async (res) =>  {
                await doUpgradeDb(res);
                setdb(res);
            });
        } 
        return () => db && db.close();
      }, [db]);

    return (
        <DbContext.Provider value={db}>
            {children}
        </DbContext.Provider>
    );
};

export {DbProvider, useDb};
