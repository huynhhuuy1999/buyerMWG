import { ImageCustom } from 'components';
import { IProductDetailProps } from 'models';
import React from 'react';

const ShippingAdressMobile: React.FC<IProductDetailProps> = ({ productDetails }) => {
	return (
		<>
			{productDetails.hasWarranty && (
				<div className='bg-[#FDF6F4] py-1 px-2.5'>
					{productDetails.warranty.warrantyPolicy && (
						<div className='flex w-full items-center'>
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
					)}
				</div>
			)}
		</>
	);
};

export default ShippingAdressMobile;
