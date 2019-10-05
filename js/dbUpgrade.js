const dbUpgrade = {
	targetVersion: 2,
	// Possible that user is more than one version behind. Assume that these statements need to be executed sequentially
	upgradeStatements: {
		to_v1: [
			// This table is no longer used as of v2
			"CREATE TABLE IF NOT EXISTS UserCreatedTerms( id INTEGER PRIMARY KEY NOT NULL, gaelic TEXT NOT NULL, english TEXT NOT NULL);",
			// Keep track of DB version
			"CREATE TABLE IF NOT EXISTS Version( version INTEGER PRIMARY KEY NOT NULL);"			
		],

		// Switching to storing all UserCreatedTerms in faclair rather than maintaing a separate table
		to_v2: [
			"ALTER TABLE UserCreatedTerms ADD COLUMN favourited int DEFAULT 1;",
			// Still need to keep track of whether or not term was created by user, do this via a new column
			"ALTER TABLE UserCreatedTerms ADD COLUMN user_created int DEFAULT 1;",
			"ALTER TABLE faclair ADD COLUMN user_created int;",
			"INSERT INTO faclair (gaelic, english, favourited, user_created) SELECT gaelic, english, favourited, user_created from UserCreatedTerms;"
		]
	}
};

export default dbUpgrade;
