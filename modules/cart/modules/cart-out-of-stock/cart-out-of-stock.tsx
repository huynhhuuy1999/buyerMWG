import { ImageCustom, ModalCustom, Skeleton } from 'components';
import { CartVariantItems } from 'models';
import Link from 'next/link';
import React from 'react';

interface IsOutOfStock {
	isOutofStock: boolean;
	dataOutOfStock?: CartVariantItems[];
	totalItems?: number;
	onClose: () => void;
	onCofirm: () => void;
}

const skeletons = () => {
	return (
		<>
			{[...new Array(2)].map((_, i: number) => (
				<div
					className='mb-4 rounded-md bg-white p-3 first:rounded-t-none last-of-type:mb-0'
					key={i}
				>
					<div className='flex gap-3'>
						<div className='flex-auto'>
							<Skeleton.Skeleton lines={2} type='comment' />
						</div>
						<div className='aspect-square max-w-[110px] flex-[110px]'>
							<Skeleton.Skeleton
								cardType={Skeleton.CardType.square}
								type='card'
								width={'100%'}
								height={'110px'}
							/>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

const MemoSkeletons = React.memo(skeletons);

const CartOutofStock: React.FC<IsOutOfStock> = ({
	isOutofStock,
	dataOutOfStock,
	totalItems,
	onClose,
	onCofirm,
}) => {
	return (
		<>
			{isOutofStock ? (
				<ModalCustom className='!px-4' width={'!w-[40%]'}>
					<div
						className='flex w-full items-center gap-3 border-b border-[#f2f2f2f2] px-3 py-2.5'
						onClick={onClose}
						onKeyPress={onClose}
						tabIndex={0}
						role={'button'}
					>
						<div className={'flex items-center'}>
							<div className='font-sfpro_semiBold text-16 font-semibold leading-5 text-[#333333]'>
								Một số mặt hàng vừa hết hàng
							</div>
						</div>
					</div>

					{Boolean(dataOutOfStock?.length) ? (
						(dataOutOfStock ?? [])?.map((itemOutofStock, i) => {
							return (
								<div
									className='flex gap-4 border-b border-b-[#E0E0E0] px-3 py-4 last-of-type:pb-6'
									key={i}
								>
									<div className='relative h-[98px] w-[98px]'>
										<ImageCustom
											src={itemOutofStock.variationImage}
											alt='vuivui'
											layout='fill'
											objectFit='contain'
										/>
									</div>
									<div className='flex items-center'>
										<div className='flex flex-col'>
											<div className='mb-3 flex flex-col'>
												<div className='text-14 font-medium'>{itemOutofStock.productName}</div>
												<span className='text-13 text-[#999999]'>
													{itemOutofStock?.propertyValueName1}
												</span>
											</div>
											<div className='font-sfpro_semiBold text-16 leading-5 text-[#EA001B]'>
												Vừa Hết hàng
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<MemoSkeletons />
					)}

					<div className='flex flex-col justify-center'>
						<div className='mx-auto max-w-[80%] pb-[18px] pt-[14px] text-center font-sfpro_semiBold text-16 font-semibold leading-5'>
							{dataOutOfStock?.length === totalItems
								? 'Tất cả sản phẩm đã hết hàng. Tiếp tục mua sắm?'
								: 'Tiếp tục Đặt hàng & Thanh toán với các sản phẩm còn hàng?'}
						</div>
						<div className='flex items-center gap-4 px-4 pb-[8px]'>
							<button
								className='flex-auto rounded-md bg-[#DADDE1] py-[14px] text-center text-[#333333]'
								onClick={onClose}
							>
								Hủy bỏ
							</button>
							<div
								className={`flex-auto ${!Boolean(dataOutOfStock?.length) && 'cursor-not-allowed'}`}
							>
								{dataOutOfStock?.length === totalItems ? (
									<Link href={'/'}>
										<button
											className={`w-full rounded-md bg-[#F05A94] py-[14px] text-center text-white ${
												!Boolean(dataOutOfStock?.length) ? 'pointer-events-none' : 'cursor-pointer'
											}`}
											onClick={onCofirm}
										>
											Tiếp tục mua sắm
										</button>
									</Link>
								) : (
									<button
										className={`w-full rounded-md bg-[#F05A94] text-white py-[14px] text-center ${
											!Boolean(dataOutOfStock?.length) ? 'pointer-events-none' : 'cursor-pointer'
										}`}
										onClick={onCofirm}
									>
										Đồng ý và tiếp tục
									</button>
								)}
							</div>
						</div>
					</div>
				</ModalCustom>
			) : null}
		</>
	);
};

export default CartOutofStock;
