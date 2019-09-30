import React, {useReducer} from 'react';

const AddWordStateContext = React.createContext();
const AddWordDispatchContext = React.createContext();

const useAddWordState = () => {
	const context = React.useContext(AddWordStateContext);
	if(!context) {
		throw new Error('useAddWordState must be used within AddWordProvider');
	}
	return context;
};

const useAddWordDispatch = () => {
	const context = React.useContext(AddWordDispatchContext);
	if(!context) {
		throw new Error('useAddWordDispatch must be used within AddWordProvider');
	}
	return context;
};

const addWordReducer = (state, action) => {
	switch(action.type) {
		case 'toggleVisible': {
			return {...state, visible: !state.visible};
		}
		case 'setInitialValues': {
			return {...state, initialValues: action.value};
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	};
};

const AddWordProvider = ({children}) => {
	const [state, dispatch] = useReducer(addWordReducer, {visible: false, initialValues: {}});

	return (
		<AddWordStateContext.Provider value={state}>
			<AddWordDispatchContext.Provider value={dispatch}>
				{children}
			</AddWordDispatchContext.Provider>
		</AddWordStateContext.Provider>
	);
};

export {
	AddWordProvider,
	useAddWordState,
	useAddWordDispatch
};