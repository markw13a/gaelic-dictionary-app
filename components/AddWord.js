import React, {useState} from 'react';	
import {Alert, Button, Modal, View, TextInput} from 'react-native';

const AddDefaultWordButton = ({setVisible}) => (
	<View>
		<Button 
			title="Add new word"
			onPress={() => setVisible(true)}
		/>
	</View>
);

const AddNewWordDialog = ({db, initialValues={}, AddWordButton=AddDefaultWordButton}) => {
	// If search term is not found, want to provide "Add word" button for user to click
	// Their search-term should already be filled in. Nice time-saver.
	const [gaelic, setGaelic] = useState(initialValues.gaelic);
	const [english, setEnglish] = useState(initialValues.english);
	const [visible, setVisible] =  useState(false);

	if(!visible) {
		return <AddWordButton setVisible={setVisible} />;
	}

	return (
		<Modal
			transparent={false}
			visible={visible}
		>
			<View>
				<View>
					<TextInput value={gaelic} onChangeText={text => setGaelic(text)} />
					<TextInput value={english} onChangeText={text => setEnglish(text)} />
				</View>
				<View>
					<Button title="Save" onPress={() => {
						if( !gaelic || !english ) {
							Alert.alert('Fields must not be blank');
							return;
						}

						if(db) {
							db.executeSql(`INSERT INTO UserCreatedTerms (gaelic, english) VALUES ("${gaelic}", "${english}");`, [])
							.then(() => setVisible(false));
						}
					}} />
					<Button title="Cancel" onPress={() => setVisible(false)} />
				</View>
			</View>
		</Modal>
	);
};

export default AddNewWordDialog;