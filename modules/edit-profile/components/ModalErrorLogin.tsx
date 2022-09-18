import { ImageCustom } from 'components';
import React from 'react';

interface IModalErrorLogin {
	info: any;
	onOK?: () => void;
}

const ModalErrorLogin: React.FC<IModalErrorLogin> = ({ info, onOK }) => {
	return (
		<div className='relative z-20' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
			{/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
			<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

			<div className='fixed inset-0 z-20 overflow-y-auto'>
				<div className='flex min-h-full items-end justify-center text-center sm:items-center sm:p-0'>
					<div className='relative h-screen w-full overflow-hidden bg-white text-left shadow-xl  transition-all'>
						<div className='relative bg-white px-4 pt-2 pb-4'>
							<div className='mx-auto flex items-center justify-center'>
								<div className='mt-5 text-left'>
									<div className='mb-[30px] mt-[50px] text-center flex justify-center'>
										<ImageCustom
											className='cursor-pointer '
											src='/static/svg/notify.svg'
											alt='notify'
											height={70}
											width={70}
										/>
									</div>

									<p className='color-[#333333] mb-[8px] text-center font-sfpro_semiBold text-18'>
										Không thể cập nhật số điện thoại {info?.phone || ''} vào tài khoản hiện tại
									</p>

									<p className='color-[#333333] mb-[32px] font-sfpro text-16'>
										Rất tiếc VuiVui.com không thể cập nhật số điện thoại {info?.phone || ''} vào tài
										khoản hiện tại của bạn vì số điện thoại đã có tài khoản
									</p>

									<button
										onClick={() => onOK && onOK()}
										className='mb-[12px] w-full text-center font-sfpro_semiBold text-16 text-[#126BFB]'
									>
										Sử dụng số điện thoại khác
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

export default ModalErrorLogin;
