import classNames from 'classnames';

import Notification from '.';
import { ConfirmNotificationProps } from './types';

export const ConfirmNotification: React.FC<ConfirmNotificationProps> = ({
	message,
	contextConfirm,
	contextNotConfirm,
	onConfirm,
	onNotConfirm,
	titleHead,
}) => {
	return (
		<div
			id='confirmNotification-vuivui'
			className={classNames([
				'bg-[rgba(256,256,256,.2)] fixed top-0 left-0 right-0 bottom-0 h-full overflow-hidden w-full z-[80]',
			])}
		>
			<div
				className={classNames([
					'alignCenterScreen__fixed animation-300 lg:w-auto w-[90%] z-[80] shadow-xl',
					'opacity-100 visible',
				])}
			>
				<div
					className={classNames([
						'bg-[#FFFFFF] w-full mx-auto px-12 py-6 rounded-lg text-[#272728]',
					])}
				>
					<div className='mb-8'>
						<span className='mb-2 block text-center font-sfpro_semiBold text-18 font-semibold leading-7'>
							{titleHead}
						</span>
						<span>{message}</span>
					</div>
					<div className='flex items-center justify-center gap-4'>
						<button
							className='animation-300 flex-auto rounded-md border border-pink-F05A94 bg-pink-F05A94 p-3 text-white hover:bg-F05A94/80'
							onClick={() => {
								onConfirm();
							}}
						>
							{contextConfirm}
						</button>
						<button
							className='animation-300 flex-auto rounded-md border border-[#E7E7E8] p-3 hover:border-[#a9a9a9a9] hover:bg-[#a9a9a9a9] hover:text-white'
							onClick={() => {
								onNotConfirm();
								Notification.Confirm.remove();
							}}
						>
							{contextNotConfirm}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
