// import { Icon } from '@/components'
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { useAppCart, useAuth } from 'hooks';
import Link from 'next/link';
import React, { useState } from 'react';

import ModalQRReader from '@/modules/orders-customer/components/modelQrReader';
import { truncateString } from '@/utils/formatter';

const HeaderCustomer: React.FC = () => {
	const { currentUser } = useAuth();
	const { cartState } = useAppCart();

	const [openQRCode, setOpenQRCode] = useState<boolean>(false);

	const handleCloseQRCode = () => {
		setOpenQRCode(!openQRCode);
	};

	return (
		<div className='bg-white px-2.5 pt-4 pb-2.5'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center justify-start'>
					<Link href='/ca-nhan/chinh-sua-thong-tin' passHref>
						<a className='flex'>
							<div
								className='relative mr-3 h-40px w-40px cursor-pointer overflow-hidden rounded-full'
								tabIndex={0}
								role='button'
							>
								<ImageCustom
									src={currentUser?.avatarImage?.fullPath ?? EmptyImage}
									alt='imageMockup'
									layout='fill'
									className='h-full w-full object-cover'
								/>
							</div>

							{currentUser?.mobilePhone && currentUser?.fullName ? (
								<div className='flex flex-col'>
									<div className='text-base font-semibold leading-6'>
										{truncateString(currentUser?.fullName || '', 15)}
									</div>
									<span className='text-13 font-normal'>Chỉnh sửa hồ sơ</span>
								</div>
							) : (
								<button className='ml-[16px] flex-1 rounded-[4px] bg-[#F05A94] px-[24px] py-[10px] font-sfpro text-14 text-white'>
									Cập nhật thông tin
								</button>
							)}
						</a>
					</Link>
				</div>
				<div className='flex items-center gap-3'>
					<button className='relative mr-2 h-[24px] w-[24px]' onClick={handleCloseQRCode}>
						<ImageCustom src={'/static/svg/icon-qr-code.svg'} alt='arrow back icon' layout='fill' />
					</button>
					{/* redirect into cart page */}
					{cartState.total > 0 && (
						<a href='/gio-hang'>
							<div className='relative mr-5 h-6 w-6'>
								<ImageCustom
									src='/static/svg/cart_mobile_outline.svg'
									alt='iconCart'
									className='stroke-2 '
									layout='fill'
								/>
								<div className='line absolute top-[-2px] left-[14px] rounded-20px bg-DF0707 px-1 text-center text-10 font-bold leading-[16px] text-white'>
									{cartState.total > 99 ? '99+' : cartState.total}
								</div>
							</div>
						</a>
					)}
				</div>
			</div>
			{openQRCode && <ModalQRReader onClose={handleCloseQRCode} />}
		</div>
	);
};

export default HeaderCustomer;
