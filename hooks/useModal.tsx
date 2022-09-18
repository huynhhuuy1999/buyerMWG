import { useState } from 'react';

export const useModal = () => {
	const [isOpenModal, setModalOpen] = useState<boolean>(false);

	const toggleModal = () => {
		setModalOpen(!isOpenModal);
	};

	return { isOpenModal, toggleModal };
};
