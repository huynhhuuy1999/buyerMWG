import classNames from 'classnames';
import { ImageCustom } from 'components';
import { ICartPageProps } from 'models';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { handleAddVouchers, handleDeleteVouchers } from 'utils';

import timeConfig from '@/configs/timeConfig';
import { formatTime } from '@/utils/convertTime';

const CartVouchers: React.FC<ICartPageProps> = ({ dataCart, onMutable, dataVouchers }) => {
	const [isActivePopover, setIsActivePopover] = useState<boolean>(false);
	const [CheckedVouchersState, setListCheckedVouchersState] = useState<string>();

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isActivePopover) {
			const handleClickOutside = (event: any) => {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsActivePopover(false);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isActivePopover]);

	return (
		<div className='relative mb-2 flex items-center justify-between rounded-md bg-white border-[#E3E3E3] border p-3'>
			<div className='flex items-center space-x-2'>
				<div className='relative h-[20px] w-[20px]'>
					<ImageCustom layout='fill' alt='' src={'/static/svg/promotion-cart-icon.svg'} />
				</div>
				<div className='font-sfpro_bold text-16 font-semibold'>Khuyến mãi:</div>
				<div className='font-sfpro text-[14px] font-normal not-italic text-[#3E3E40]'>
					{dataVouchers && dataVouchers?.filter((ele) => ele?.isApply)?.length
						? `Đã áp dụng
					${dataVouchers && dataVouchers?.filter((ele) => ele?.isApply)?.length}
					Khuyến mãi`
						: `Bạn hiện có ${dataVouchers?.length} khuyến mãi`}
				</div>
			</div>
			{dataVouchers?.length ? (
				<>
					<div
						className='cursor-pointer font-sfpro text-[12px] font-normal not-italic leading-normal text-[#009ADA]'
						onClick={() => setIsActivePopover(!isActivePopover)}
						onKeyPress={() => setIsActivePopover(!isActivePopover)}
						tabIndex={0}
						role={'button'}
					>
						Xem chi tiết
					</div>
					<div
						className={classNames([
							'mb-2 rounded-md bg-white max-h-[300px] absolute w-full animation-100 top-[48px] left-0 border-[#E7E7E8] border shadow-xl hide-scrollbar overflow-y-scroll z-[1]',
							isActivePopover
								? 'opacity-100 visible toggleEffectDown'
								: 'opacity-0 invisible toggleEffectUp',
						])}
						ref={ref}
					>
						<p className='px-3 pt-4 font-sfpro_semiBold font-medium text-[#999999]'>
							Khuyến mãi khác
						</p>

						<div className='relative max-h-fit w-full p-3'>
							{dataVouchers?.map((item, id) => {
								return (
									<div
										className={classNames([
											Number(dataCart?.cartPayment?.paymentTotal) < item?.minOrderAmount ||
												(moment().valueOf() > moment(item?.validUntil)?.valueOf() &&
													'grayscale filter cursor-not-allowed'),
										])}
										key={id}
									>
										<button
											className={classNames([
												'w-full relative h-[124px] mb-3 bg-contain bg-no-repeat',
												Number(dataCart?.cartPayment?.paymentTotal) < item?.minOrderAmount ||
													(moment().valueOf() > moment(item?.validUntil)?.valueOf() &&
														'pointer-events-none'),
												item?.isApply
													? 'bg-[url("/static/svg/bg-voucher-active-new.svg")]'
													: 'bg-[url("/static/svg/bg-voucher-white-new.svg")]',
											])}
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
											<div className='flex items-center justify-between px-4'>
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
														<span className='mt-4 block text-12 text-[#999999]'>
															HSD: {formatTime(item?.validUntil, timeConfig.custom?.dayMothYearh)}
														</span>
													</div>
												</div>

												<div className='relative mr-3 h-[20px] w-[20px]'>
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
									</div>
								);
							})}
						</div>

						<div className='bottom-0 bg-white p-3 pl-[50%]' style={{ position: 'sticky' }}>
							<div className='flex items-center justify-end'>
								<button
									className='flex w-full items-center justify-center rounded-md py-4 px-7 hover:bg-[#f8f8f8]'
									onClick={() => setIsActivePopover(!isActivePopover)}
								>
									Trở lại
								</button>
								<button
									className='flex w-full items-center justify-center rounded-md bg-[#F05A94] py-4 px-7 text-white'
									onClick={() => setIsActivePopover(!isActivePopover)}
								>
									Đồng ý
								</button>
							</div>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
};

export default CartVouchers;
