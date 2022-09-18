import classNames from 'classnames';
import { useEffect } from 'react';

import ImageCustom from '../ImageCustom';
import Notification from '.';
import { ComingNotificationsProps } from './types';

export const ComingNotification: React.FC<ComingNotificationsProps> = ({
	titleHeade,
	icon,
	message,
	className,
	timeout,
	isOpen,
	onClick,
}) => {
	useEffect(() => {
		if (isOpen) {
			const time = setTimeout(() => Notification.Coming.remove(), timeout ? timeout : 3000);
			return () => {
				clearTimeout(time);
			};
		}
	}, [isOpen]);
	return (
		<div
			id='comingNotification-vuivui'
			className={classNames([
				'fixed top-0 right-0 animation-300 lg:w-80 w-80 z-[80]',
				isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
			])}
		>
			<audio autoPlay>
				<source src='/static/sounds/new-notification.wav' />
				<track kind='captions' />
			</audio>
			<div
				className={classNames([
					'grid grid-cols-6 gap-3 bg-black bg-opacity-60 w-full py-2 rounded-[3px] items-center',
					className,
				])}
			>
				{icon && (
					<div className='relative col-span-1 mx-2 h-10 w-10'>
						<ImageCustom src={icon} layout='fill' className='rounded-full bg-[#F5F5F5]' />
					</div>
				)}
				<div className='col-span-5 block text-left font-sfpro_semiBold font-semibold leading-7 text-white'>
					<span className='mb-1 block text-18'>{titleHeade}</span>
					<span className='block text-14'>{message}</span>
				</div>
			</div>
		</div>
	);
};
