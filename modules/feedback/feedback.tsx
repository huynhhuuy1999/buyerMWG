import React, { useState } from 'react';

import ImageCustom from '@/components/ImageCustom';

import ModalFeedback from './modal-feedback';

interface IProps {
	width?: string;
	height?: string;
}
const Feedback: React.FC<IProps> = ({ width, height }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleShowModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<button
				className='relative z-[100] cursor-pointer opacity-90 hover:opacity-100'
				onClick={() => handleShowModal()}
			>
				<ImageCustom
					src='/static/svg/chat-text-fill.svg'
					width={width || 50}
					height={height || 48}
				/>
			</button>
			{isOpen && <ModalFeedback isOpen={isOpen} onShowModal={handleShowModal} />}
		</>
	);
};
export default Feedback;
