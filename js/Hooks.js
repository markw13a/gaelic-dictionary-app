import { useState, useCallback } from "react";

const useToggleModal = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const toggleIsModalVisible = useCallback(() => {
		setIsModalVisible(!isModalVisible);
	}, [isModalVisible, setIsModalVisible]);

	return {
		isModalVisible,
		toggleIsModalVisible
	}
};

export {
	useToggleModal
};