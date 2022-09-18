import classNames from 'classnames';
import { ImageCustom, Notification } from 'components';
import React, { useEffect } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

import { InfoNotificationsProps } from './types';

export const InfoNotifications: React.FC<InfoNotificationsProps> = ({
	message,
	className,
	status,
	timeout,
	isOpen,
}) => {
	useEffect(() => {
		if (isOpen) {
			const time = setTimeout(() => Notification.Loading.remove(), timeout);
			return () => {
				clearTimeout(time);
			};
		}
	}, [isOpen]);

	return (
		<div
			id='infoNotification-vuivui'
			className={classNames([
				'animation-300 lg:w-auto w-[calc(100%_-_20px)] z-[80]',
				isOpen ? 'opacity-100 visible transition-opacity' : 'opacity-0 invisible',
				'xs:bottom-[72px] xs:left-[50%] xs:transform xs:-translate-x-[50%] xs:fixed lg:alignCenterScreen__fixed',
			])}
		>
			<div
				className={classNames([
					'bg-black bg-opacity-60 w-full mx-auto p-12 rounded-[3px]',
					'hidden lg:block',
					className,
				])}
			>
				<div className='relative mx-auto mb-6 h-[78px] w-[78px]'>
					{status === 'SUCCESS' && (
						<ImageCustom
							src='/static/svg/success-icon.svg'
							alt='vuivui icon success'
							layout='fill'
							priority
						/>
					)}

					{status === 'ERROR' && (
						<ImageCustom
							src='/static/svg/failed-payment-icon.svg'
							alt='vuivui icon error'
							layout='fill'
							priority
						/>
					)}
				</div>
				<span className='block text-center font-sfpro_semiBold text-18 font-semibold leading-7 text-white'>
					{message}
				</span>
			</div>
			<div
				className={classNames([
					'bg-[#0E0E10] bg-opacity-[95%] w-full mx-auto py-3 px-4 rounded-[3px]',
					'hidden xs:block lg:hidden',
					className,
				])}
			>
				<div className='flex items-center gap-[8px]'>
					<div className='w-[24px] h-[24px] rounded-full flex items-center'>
						{status === 'SUCCESS' && (
							<Icon name={IconEnum.CheckCircle} fill={'#1DC638'} color={'#0E0E10'} size={24} />
						)}

						{status === 'ERROR' && (
							<Icon name={IconEnum.XCircle} fill={'#EA001B'} color={'#0E0E10'} size={24} />
						)}
					</div>
					<span className='block text-14 leading-5 text-white'>{message}</span>
				</div>
			</div>
		</div>
	);
};
