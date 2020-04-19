const dbUpgrade = {
	targetVersion: 2,
	// Possible that user is more than one version behind. Assume that these statements need to be executed sequentially
	upgradeStatements: {
		// Use virtual fts5 to make matching text search quicker and easier
		// https://sqlite.org/fts5.html
		to_v1: [
			'CREATE VIRTUAL TABLE IF NOT EXISTS search using fts4(gaelic, gaelic_no_accents, english, favourited, user_created);',
			'INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) SELECT gaelic, gaelic_no_accents, english, favourited, user_created from faclair;'
		],
		// Extend virtual table with additional data from original faclair database
		to_v2: [
			// Create new virtual table
			'CREATE VIRTUAL TABLE IF NOT EXISTS search2 using fts4(gaelic, english, wordClass, grammar, ipa, favourited, user_created, gaelic_no_accents);',
			// Copy over all data from faclair
			'INSERT INTO search2 (gaelic, english, wordClass, grammar, ipa, favourited, user_created, gaelic_no_accents) SELECT gaelic, english, wordClass, grammar, ipa, favourited, user_created, gaelic_no_accents from faclair;',
			// Copy over all user_created terms from search
			'INSERT INTO search2 (gaelic, gaelic_no_accents, english, favourited, user_created) SELECT gaelic, gaelic_no_accents, english, favourited, user_created from search WHERE search.user_created > 0;',
			// Drop search
			'DROP TABLE search;',
			// Rename new VT to search
			'ALTER TABLE search2 RENAME to search;',
		]
	}
};

export default dbUpgrade;
