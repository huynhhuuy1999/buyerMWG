import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import Icon from '@/components/Icon';

const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

interface IModalQRReader {
	onClose: () => void;
}

const ModalQRReader: React.FC<IModalQRReader> = ({ onClose }) => {
	const [value, setValue] = useState<string | null>();
	return (
		<div
			className='fixed top-0 left-0 z-[99] h-screen w-screen'
			aria-labelledby='modal-title'
			role='dialog'
			aria-modal='true'
		>
			<button className='fixed inset-0 bg-black/75 transition-opacity' onClick={onClose}></button>

			<div className='fixed inset-0 z-10 overflow-y-auto'>
				<button
					className='absolute top-[16px] left-[16px] h-[34px] w-[34px] rounded-full bg-[#9f9f9f] p-2'
					onClick={(e) => {
						e.preventDefault();
						onClose();
					}}
				>
					<Icon
						type={'icon-close'}
						className='mt-[6px] ml-[6px] items-center text-white'
						size={26}
						variant='light'
					/>
				</button>
				<div className='flex h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
					<div className='relative w-full overflow-hidden rounded-lg text-left  transition-all'>
						<QrReader
							onError={(err) => {
								setValue(err);
							}}
							onScan={(data) => {
								setValue(data);
							}}
							style={{ width: '100%' }}
							facingMode={'environment'}
						/>
						<div className='mt-4 text-center text-[18px] font-semibold text-white'>
							Di chuyển camera đến mã QR để quét
						</div>
						{value && (
							<div className=' fixed left-0 mt-4 w-full text-center text-[18px] font-semibold text-white'>
								{value}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalQRReader;
