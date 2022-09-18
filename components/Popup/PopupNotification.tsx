import classNames from 'classnames';
import { ImageCustom } from 'components';
import React, { useEffect } from 'react';

type StatusType = 'SUCCESS' | 'ERROR' | 'PENDING' | 'WARNING' | 'INFO';

interface IPopupNotification {
	message: any;
	status: StatusType;
	className?: string;
	timeout?: number; //default 3s
	isOpen: boolean;
	onClick?: React.MouseEventHandler;
	onClose: () => void;
}

const PopupNotification: React.FC<IPopupNotification> = ({
	message,
	status,
	className,
	isOpen,
	onClose,
	timeout = 3000,
	onClick,
}) => {
	useEffect(() => {
		if (isOpen) {
			const time = setTimeout(() => onClose(), timeout);
			return () => {
				clearTimeout(time);
			};
		}
	}, [isOpen]);
	return (
		<div
			className={classNames([
				'alignCenterScreen__fixed animation-300',
				isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
			])}
		>
			<div
				className={classNames([
					'bg-black bg-opacity-60 w-full mx-auto p-12 rounded-[3px]',
					className,
				])}
			>
				<div className='relative mx-auto mb-6 h-[78px] w-[78px]'>
					<ImageCustom src='/static/svg/success-icon.svg' alt='vuivui icon success' layout='fill' />
				</div>
				<span className='text-center font-sfpro_semiBold text-18 font-semibold leading-7 text-white'>
					{message}
				</span>
			</div>
		</div>
	);
};

export default PopupNotification;
