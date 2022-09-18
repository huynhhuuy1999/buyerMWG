import { ImageCustom } from 'components';
import React from 'react';

interface IModalConfirmMerge {
	info: any;
	onOK?: () => void;
	onClose?: () => void;
}

const ModalConfirmMerge: React.FC<IModalConfirmMerge> = ({ info, onOK, onClose }) => {
	return (
		<div className='relative z-20' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
			{/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
			<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

			<div className='fixed inset-0 z-20 overflow-y-auto'>
				<div className='flex min-h-full items-end justify-center text-center sm:items-center sm:p-0'>
					<div className='relative w-full overflow-hidden bg-white text-left shadow-xl  transition-all'>
						<div className='relative bg-white px-4 pt-2 pb-4'>
							<div className='mx-auto flex items-center justify-center'>
								<div className='mt-5 text-left'>
									<div className='mb-[30px] text-center flex justify-center'>
										<ImageCustom
											className='cursor-pointer '
											src='/static/svg/notify.svg'
											alt='notify'
											height={70}
											width={70}
										/>
									</div>

									<p className='color-[#333333] mb-[8px] font-sfpro_semiBold text-18'>
										Số điện thoại {info?.phone || ''} đang được sử dụng trên app VuiVui.com cài ở
										thiết bị {info?.phoneName || ''}
									</p>

									<p className='color-[#333333] mb-[52px] font-sfpro text-16'>
										Nếu tiếp tục trên thiết bị hiện tại, số điện thoại {info?.phone || ''} sẽ không
										thể sử dụng trên app VuiVui cài ở thiết bị khác
									</p>

									<p className='color-[#333333] mb-[12px] font-sfpro_semiBold text-16'>
										Bạn có chắc muốn tiếp tục?
									</p>

									<button
										className='mb-[8px] w-full rounded-[6px] bg-[#EA001B] py-[14px] text-[#ffffff]'
										onClick={() => onOK && onOK()}
									>
										Có, tôi muốn tiếp tục trên thiết bị này
									</button>
									<button
										className='w-full rounded-[6px] bg-[#DADDE1] py-[14px] text-[#333333]'
										onClick={() => onClose && onClose()}
									>
										Huỷ bỏ
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalConfirmMerge;
