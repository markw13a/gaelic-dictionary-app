const dbUpgrade = {
	targetVersion: 1,
	// Possible that user is more than one version behind. Assume that these statements need to be executed sequentially
	upgradeStatements: {
		// Use virtual fts5 to make matching text search quicker and easier
		// https://sqlite.org/fts5.html
		to_v1: [
			'CREATE VIRTUAL TABLE IF NOT EXISTS search using fts4(gaelic, gaelic_no_accents, english, favourited, user_created);',
			'INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) SELECT gaelic, gaelic_no_accents, english, favourited, user_created from faclair;'
		]
	}
};

export default dbUpgrade;
