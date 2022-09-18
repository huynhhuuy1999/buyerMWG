import classNames from 'classnames';
import { ModalCustom, Notification, RadioField } from 'components';
import { useAppCart } from 'hooks';
import { OrderDetails, PaymentMethod } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { createRetryPayment } from 'services';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';
import { setPaymentMethodHelpers } from '@/utils/setPaymentMethodHelpers';

interface RetryPaymentProps {
	isOpen: boolean;
	StateOrder?: OrderDetails | null;
	paymentMethod?: PaymentMethod[];
	defaultValue?: number;
	onCancel: () => void;
}

const RetryPayment: React.FC<RetryPaymentProps> = ({
	isOpen,
	StateOrder,
	paymentMethod,
	defaultValue,
	onCancel,
}) => {
	const [typeValue, setTypeValue] = useState<number>();
	const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
	const router = useRouter();
	const { cartId } = useAppCart();

	useEffect(() => {
		defaultValue && setTypeValue(defaultValue);
	}, [defaultValue]);

	const handleRetryPayment = async (data: any) => {
		Notification.Loading.custom();
		try {
			const { data: OrderResult } = await createRetryPayment({
				orderId: data?.orderId,
				paymentType: data?.paymentType,
				appLink: '',
				urlCallBack: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment`,
			});
			if (OrderResult.orderId && !OrderResult.payUrl) {
				Notification.Loading.remove(300);
				data?.paymentType === 6 && router.push('/payment');
			}

			if (OrderResult.payUrl) {
				Notification.Loading.remove(300);
				router.push(OrderResult.payUrl);
			}
		} catch (error) {
			getErrorMessageInstance(error);
		}
	};

	const handleOnClick = (checkedValue: number) => {
		setTypeValue(checkedValue);
	};
	return (
		<React.Fragment>
			{isOpen ? (
				<ModalCustom>
					<p className='font-sfpro_semiBold text-18  font-bold text-[#333333] '>
						Chuyển đổi hình thức thanh toán
					</p>
					<span className='block border-b border-[#E7E7E8] pb-2 text-14 text-[#666666]'>
						Mã đơn hàng: #{StateOrder?.orderId}
					</span>

					<div className='mt-4 grid grid-cols-2 gap-2'>
						{paymentMethod?.map((item, i: number) => (
							<div
								className={classNames([
									'cursor-pointer group relative animation-100',
									'flex items-center p-3 border border-solid rounded-lg box-border',
									typeValue === item.id ? 'border-[#FEBEF2] bg-[#F7F5FE]' : 'border-[#E7E7E8]',
									StateOrder?.payment?.paymentType === item.id
										? 'cursor-not-allowed'
										: 'cursor-pointer',
								])}
								key={i}
							>
								<div
									className={classNames([
										StateOrder?.payment?.paymentType === item.id
											? 'grayscale filter pointer-events-none'
											: 'cursor-pointer',
										isLoadingPayment && !Boolean(typeValue === item.id)
											? 'opacity-60 pointer-events-none'
											: 'opacity-100 cursor-pointer',
									])}
									tabIndex={0}
									role={'button'}
									onClick={() => {
										setPaymentMethodHelpers(cartId ?? '', { paymentType: item.id }, (loading) => {
											setIsLoadingPayment(loading);
										});
										handleOnClick(item.id);
									}}
									onKeyPress={() => {
										setPaymentMethodHelpers(cartId ?? '', { paymentType: item.id }, (loading) => {
											setIsLoadingPayment(loading);
										});
										handleOnClick(item.id);
									}}
								>
									<RadioField
										id={String(item.id)}
										name={'paymentType'}
										render={
											<div
												className={classNames([
													'w-full h-full flex pl-8 cursor-pointer items-center',
													StateOrder?.payment?.paymentType === item.id
														? 'grayscale filter pointer-events-none'
														: 'cursor-pointer',
												])}
											>
												{item.image && <img className='h-8 w-8' src={item.image} alt='item icon' />}
												<div className={classNames(['pt-2 pl-1'])}>
													<span className='font-sfpro text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#1A1A1C]'>
														{item.title}
													</span>
													{item.sub && (
														<div className='font-sfpro text-[12px] font-normal not-italic leading-[1.3] tracking-[0.04px] text-[#EB8A26]'>
															{item.sub}
														</div>
													)}
												</div>
											</div>
										}
										checked={typeValue === item.id}
										styles={{ label: 'text-14' }}
										value={item.id}
									/>
								</div>
							</div>
						))}
					</div>
					<div className='mt-4 flex items-center justify-center gap-4'>
						<button
							className='animation-300 flex-auto rounded-md border border-F05A94 bg-F05A94 p-3 text-white hover:bg-F05A94/80'
							onClick={() => {
								handleRetryPayment({
									orderId: StateOrder?.orderId,
									paymentType: typeValue,
								});
								setTypeValue(0);
								onCancel();
							}}
						>
							Đồng ý
						</button>
						<button
							className='animation-300 flex-auto rounded-md border border-[#E7E7E8] p-3 hover:border-[#a9a9a9a9] hover:bg-[#a9a9a9a9] hover:text-white'
							onClick={() => {
								setTypeValue(0);
								onCancel();
							}}
						>
							Hủy bỏ
						</button>
					</div>
				</ModalCustom>
			) : null}
		</React.Fragment>
	);
};

export default RetryPayment;
