import classNames from 'classnames';
import { ImageCustom } from 'components';
import { MODE_RUNNER } from 'enums';
import { IProductDetailProps } from 'models';
import { NextPage } from 'next';
import React from 'react';

const ShippingAdress: NextPage<IProductDetailProps> = ({ productDetails, mode }) => {
	return (
		<div
			className={classNames([
				[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
					'pointer-events-none',
			])}
		>
			<div className='my-4 rounded-[3px] bg-[#FDF6F4] px-4 py-3 font-sfpro_bold text-14 font-semibold leading-5'>
				<div className='flex items-center'>
					<div className='relative h-4 w-2.5'>
						<ImageCustom src={'/static/svg/map-product.svg'} alt='map vuivui' layout='fill' />
						<span className='absolute top-1/4 left-2/4 h-[3px] w-[3px] -translate-x-2/4 -translate-y-1/4 rounded-full bg-black'></span>
					</div>
					<span className='ml-14px inline'>
						Chưa cập nhật{' '}
						<span className='cursor-pointer font-sfpro text-primary-009ADA'>(Thay đổi)</span>
					</span>
				</div>
			</div>
			{productDetails?.hasWarranty && (
				<div className='py-18px px-4'>
					{productDetails.warranty.warrantyPolicy ? (
						<div className='mt-4 flex w-full items-center'>
							<div className='relative h-4 w-4'>
								<ImageCustom
									src={'/static/svg/purchase.svg'}
									alt='purchanse vuivui'
									layout='fill'
								/>
							</div>
							<span className='block pl-2.5'>
								{productDetails.warranty.warrantyPolicy}
								<span className='cursor-pointer pl-1 text-1A94FF'>Xem chi tiết</span>
							</span>
						</div>
					) : (
						''
					)}
				</div>
			)}
		</div>
	);
};

export default ShippingAdress;
