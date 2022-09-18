import classNames from 'classnames';
import { ImageCustom } from 'components';
import { ICartPageProps } from 'models';
import { useEffect, useRef, useState } from 'react';
import { handleAddVouchers, handleDeleteVouchers } from 'utils';

import timeConfig from '@/configs/timeConfig';
import { formatTime } from '@/utils/convertTime';

import { Drawer } from '../../components';

const CartVouchersMobile: React.FC<ICartPageProps> = ({ dataCart, onMutable, dataVouchers }) => {
	const [isShowDrawerPromotion, setIsShowDrawerPromotion] = useState<boolean>(false);
	const [CheckedVouchersState, setListCheckedVouchersState] = useState<string>();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isShowDrawerPromotion) {
			const handleClickOutside = (event: any) => {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsShowDrawerPromotion(false);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isShowDrawerPromotion]);

	return (
		<>
			<div className='relative mb-2 flex items-center gap-2 rounded-md bg-white p-3'>
				<div className='flex items-center space-x-2'>
					<div className='relative h-[20px] w-[20px]'>
						<ImageCustom layout='fill' alt='' src={'/static/svg/promotion-cart-icon.svg'} />
					</div>
					<div className='font-sfpro_bold text-16 font-semibold'>Khuyến mãi:</div>
					<div className='font-sfpro text-[14px] font-normal not-italic text-[#3E3E40]'>
						{dataCart?.vouchers && dataCart?.vouchers?.filter((ele) => ele?.isApply)?.length
							? `Đã áp dụng
					${dataCart?.vouchers && dataCart?.vouchers?.filter((ele) => ele?.isApply)?.length}
					Khuyến mãi`
							: `Bạn hiện có ${dataCart?.vouchers?.length} khuyến mãi`}
					</div>
				</div>
				<div
					className='cursor-pointer font-sfpro text-[14px] font-normal not-italic leading-normal text-[#009ADA]'
					onClick={() => {
						setIsShowDrawerPromotion(!isShowDrawerPromotion);
					}}
					onKeyPress={() => {
						setIsShowDrawerPromotion(!isShowDrawerPromotion);
					}}
					tabIndex={0}
					role={'button'}
				>
					<span className='text-[#333333]'>(</span>Thay đổi<span className='text-[#333333]'>)</span>
				</div>
			</div>
			<Drawer
				isOpen={isShowDrawerPromotion}
				direction='BOTTOM'
				className={'hide-scrollbar z-[20] overflow-auto'}
				height={'h-[100vh]'}
				setIsOpen={() => setIsShowDrawerPromotion(false)}
			>
				<div
					className={classNames([
						'mb-2 rounded-md bg-white w-full h-auto animation-100 max-h-[70vh] top-[48px] left-0 border-[#E7E7E8] border shadow-xl hide-scrollbar overflow-y-scroll z-10',
					])}
					ref={ref}
				>
					<p className='px-3 pt-4 font-sfpro_semiBold font-medium text-[#999999]'>
						Khuyến mãi khác
					</p>

					<div className='relative w-full p-3'>
						{dataVouchers?.map((item, id) => {
							return (
								<button
									className={classNames([
										'w-full relative h-full mb-3',
										Number(dataCart?.cartPayment?.paymentTotal) < item?.minOrderAmount &&
											'grayscale filter pointer-events-none',
									])}
									key={id}
									onClick={() => {
										if (CheckedVouchersState === item?.voucherId) {
											setListCheckedVouchersState(item?.voucherId);
											handleDeleteVouchers(dataCart?.cartId ?? '', item?.voucherId, onMutable);
										} else {
											setListCheckedVouchersState('');
											handleAddVouchers(dataCart?.cartId ?? '', item?.voucherId, onMutable);
										}
									}}
								>
									<div className='absolute inset-0'>
										<div className='relative aspect-[4/1] h-full w-full'>
											<ImageCustom
												alt=''
												objectFit='fill'
												src={
													item?.isApply
														? '/static/svg/bg-voucher-active-new.svg'
														: '/static/svg/bg-voucher-white-new.svg'
												}
												layout={'fill'}
											/>
										</div>
									</div>
									<div className='relative z-20 flex items-center justify-between px-4'>
										<div className='flex items-center gap-2'>
											<div className='relative h-[32px] w-[32px]'>
												<ImageCustom layout='fill' src={'/static/images/tgdd-logo.png'} />
											</div>
											<div className='flex flex-col text-left'>
												<p className='font-sfpro_semiBold text-14 font-semibold text-[#333333] first-letter:uppercase'>
													{item?.programName}
												</p>
												<span className='text-12'>
													Giảm: {item?.discountValue?.toLocaleString('it-IT')}đ
												</span>
												<span className='text-12'>
													Đơn tối thiểu: {item?.minOrderAmount?.toLocaleString('it-IT')}đ
												</span>
												<span className='mt-2 block text-12 text-[#999999]'>
													HSD: {formatTime(item?.validUntil, timeConfig.custom?.dayMothYearh)}
												</span>
											</div>
										</div>

										<div className='relative h-[20px] w-[20px]'>
											<ImageCustom
												layout='fill'
												alt=''
												src={
													item?.isApply
														? '/static/svg/radio-icon-active.svg'
														: '/static/svg/radio-icon-not-active.svg'
												}
											/>
										</div>
									</div>
								</button>
							);
						})}
					</div>

					<div className='bottom-0 z-[50] gap-2 bg-white p-3' style={{ position: 'sticky' }}>
						<div className='flex items-center justify-end'>
							<button
								className='flex w-full items-center justify-center rounded-md py-4 px-7'
								onClick={() => setIsShowDrawerPromotion(!isShowDrawerPromotion)}
							>
								Trở lại
							</button>
							<button
								className='flex w-full items-center justify-center rounded-md bg-[#F05A94] py-4 px-7 text-white'
								onClick={() => setIsShowDrawerPromotion(!isShowDrawerPromotion)}
							>
								Đồng ý
							</button>
						</div>
					</div>
				</div>
			</Drawer>
		</>
	);
};

export default CartVouchersMobile;
