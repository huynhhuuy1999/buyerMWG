import classNames from 'classnames';
import { EmptyImage } from 'constants/';
import React from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

import ImageCustom from '@/components/ImageCustom';

interface IModalPreviewAvatar {
	isMobile?: boolean;
	image: string;
	onClose: () => void;
}

const ModalPreviewAvatar: React.FC<IModalPreviewAvatar> = ({
	isMobile = false,
	image,
	onClose,
}) => {
	return (
		<div className='relative z-30' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
			{/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
			<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

			<div className='fixed inset-0 z-30 overflow-y-auto'>
				<div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
					<div
						className={classNames([
							'relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all h-fit',
							isMobile ? 'w-full' : 'w-1/2',
						])}
					>
						<div className='relative bg-white px-4 pt-0 pb-4'>
							<button
								className='absolute top-[14px] right-[10px] p-2'
								onClick={(e) => {
									e.preventDefault();
									onClose();
								}}
							>
								<Icon
									name={IconEnum.X}
									styleIcon={{ marginTop: '-10px', marginLeft: '-6px' }}
									size={24}
									color='#999999'
								/>
							</button>
							<div className='m-auto flex items-center justify-center'>
								<div className='my-9 h-[240px] w-[240px]'>
									<ImageCustom
										src={image || EmptyImage}
										alt='avatar'
										width={240}
										height={240}
										className='h-full w-full object-contain'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalPreviewAvatar;
