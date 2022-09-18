import classNames from 'classnames';
import { ImageCustom } from 'components';
import { MODE_RUNNER, PROMOTION_STATUS_SHOW, TYPE_DISCOUNT, TYPE_PRODUCT_VARIANT } from 'enums';
import { useAppChat, useAppDispatch, useAppSelector, useCountdown } from 'hooks';
import debounce from 'lodash/debounce';
import { MerchantChat } from 'models';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { handleDeleteItemCart, handleUpdateQuantityProduct } from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

import { ItemUpdateQuantityProps } from '@/modules/cart/types';
import { cartSelector } from '@/store/reducers/cartSlice';
import { formatTime } from '@/utils/convertTime';

import {
	FncBlockBuyNow,
	FncBlockCountDownPromotion,
	FncListVariationsProps,
	FncPriceTypePromotion,
	FncTagTypePromotion,
	TypeAddCartWithMultiQuantity,
} from '../types';
import { handleAddItemCart } from '../utils';

//render tag promotions component
export const RenderTagTypePromotion: React.FC<FncTagTypePromotion> = ({
	promotionType,
	mode,
	discountValue,
}) => {
	const { query } = useRouter();
	const { typePromotion, discountPercent } = query || {};

	return (
		<>
			{(promotionType === TYPE_DISCOUNT.DISCOUNT && discountValue) ||
			(Number(typePromotion) === TYPE_DISCOUNT.DISCOUNT &&
				discountPercent &&
				mode === MODE_RUNNER.PREVIEW_PROMOTION) ? (
				<span className='ml-3 bg-FEE800 px-1 text-16 font-semibold leading-6'>
					-{mode === MODE_RUNNER.PREVIEW_PROMOTION ? discountPercent : discountValue} %
				</span>
			) : null}

			{(promotionType === TYPE_DISCOUNT.FLASH_SALE && discountValue) ||
			(Number(typePromotion) === TYPE_DISCOUNT.FLASH_SALE &&
				discountPercent &&
				mode === MODE_RUNNER.PREVIEW_PROMOTION) ? (
				<span className='py-1 pr-1 text-16 font-semibold leading-6 font-sfpro_semiBold text-[#009908]'>
					-{mode === MODE_RUNNER.PREVIEW_PROMOTION ? discountPercent : discountValue} %
				</span>
			) : null}
		</>
	);
};

//render list value variations component
export const RenderListVariations: React.FC<FncListVariationsProps> = ({
	type,
	value,
	disabled,
}) => {
	switch (type) {
		case TYPE_PRODUCT_VARIANT.size:
			return (
				<div
					className={classNames([
						'relative my-auto xs:h-[44px] p-1 xs:min-w-[44px] lg:h-[59px] lg:min-w-[59px] flex items-center justify-center bg-white',
						disabled && 'cursor-not-allowed',
					])}
				>
					{value?.propertyValueName2 ?? value?.propertyValueName1}{' '}
					{disabled && (
						<>
							<span className='absolute block h-full w-full bg-white opacity-70'></span>
							<span className='absolute top-0 left-2/4 -translate-x-2/4 -translate-y-0 text-12 text-[#EA001B]'>
								Hết
							</span>
						</>
					)}
				</div>
			);

		case TYPE_PRODUCT_VARIANT.color:
			return (
				<div
					className={classNames([
						'relative h-[76px] w-[76px] rounded-[2px] bg-white overflow-hidden',
						disabled && 'cursor-not-allowed',
					])}
				>
					<ImageCustom
						src={value?.variationImage}
						alt='image product vuivui'
						width={'100%'}
						height={'100%'}
						className='object-cover'
					/>
					{disabled && (
						<>
							<span className='absolute top-0 block h-full w-full bg-white opacity-70'></span>
							<span className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-12 text-[#EA001B]'>
								Hết
							</span>
						</>
					)}
				</div>
			);

		default:
			return (
				<div
					className={classNames([
						'relative flex xs:h-[44px] xs:min-w-[44px] lg:h-[60px] lg:min-w-[60px] items-center justify-center bg-white',
						disabled && 'cursor-not-allowed',
					])}
				>
					{value?.propertyValueName2 ?? value?.propertyValueName1}
					{disabled && (
						<>
							<span className='absolute block h-full w-full bg-white opacity-70'></span>
							<span className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-12 text-[#EA001B]'>
								Hết
							</span>
						</>
					)}
				</div>
			);
	}
};

//render price promotion component
export const RenderPriceTypePromotion: React.FC<FncPriceTypePromotion> = ({
	promotionType,
	firstData,
	selectedData,
	mode,
	status,
	dataSource,
}) => {
	const { query } = useRouter();
	const { promotionPrice } = query || {};
	if (promotionType) {
		switch (promotionType) {
			case TYPE_DISCOUNT.FLASH_SALE:
			case TYPE_DISCOUNT.DISCOUNT:
			case TYPE_DISCOUNT.GIFT:
			case TYPE_DISCOUNT.FREESHIP:
				if (status === PROMOTION_STATUS_SHOW.COMING_SOON) {
					return selectedData ?? firstData
						? dataSource?.data?.price?.toLocaleString('it-IT')
						: selectedData;
				}
				return selectedData ?? firstData
					? dataSource?.data?.pricePromote?.toLocaleString('it-IT')
					: selectedData;
			case TYPE_DISCOUNT.EXTRA_DISCOUNT:
			case TYPE_DISCOUNT.INVOICE:
				return selectedData ?? firstData
					? dataSource?.data?.price?.toLocaleString('it-IT')
					: selectedData;
			default:
				return dataSource?.price?.toLocaleString('it-IT');
		}
	}
	if (mode && mode === MODE_RUNNER.PREVIEW_PROMOTION) {
		return Number(promotionPrice)?.toLocaleString('it-IT');
	}
	return selectedData ?? null;
};

//render block buy now component
export const RenderBlockBuyProduct: React.FC<FncBlockBuyNow> = React.forwardRef(
	(
		{
			idVariant,
			disableBuy,
			productDetails,
			mode,
			cartId,
			forMobile,
			onSubmit,
			scrollToVariant,
			isValidSubmit,
		},
		ref: any,
	) => {
		const payload: MerchantChat = {
			userId: productDetails.merchant.userId,
			name: productDetails.merchant.name,
			fullPath: productDetails?.merchant?.avatarImage,
			brandId: productDetails.brandId.toString(),
		};
		const { onHandleOpenChat } = useAppChat();
		const handleOpenChat = () => {
			onHandleOpenChat(payload);
		};
		const cartStateSelector = useAppSelector(cartSelector);
		const [isLoadingUpdateQuantity, setIsLoadingUpdateQuantity] = useState<boolean>(false);
		const [isChangeModeAddCart, setIsChangeModeAddCart] = useState<boolean>(false);
		const [quantityAddCart, setQuantityAddCart] = useState<number>(0);
		const [isClick, setIsClick] = useState<boolean>(false);
		const dispatch = useAppDispatch();
		const router = useRouter();

		const checkVariantHasBuyed = cartStateSelector?.variationsActice?.some(
			(ele) => ele?.variantId === idVariant,
		);

		useEffect(() => {
			checkVariantHasBuyed ? setIsChangeModeAddCart(true) : setIsChangeModeAddCart(false);
			checkVariantHasBuyed
				? setQuantityAddCart(
						cartStateSelector?.variationsActice?.find((ele) => ele?.variantId === idVariant)
							?.quantity!,
				  )
				: setQuantityAddCart(0);
			setIsClick(false);
		}, [idVariant]);

		const deBounceUpdateOnClickQuantity = useRef(
			debounce((item: ItemUpdateQuantityProps) => {
				handleUpdateQuantityProduct(
					item,
					() => {},
					dispatch,
					() => {
						handleDeleteItemCart(
							{
								merchantId: item.merchantId,
								reservationId: item.reservationId!,
								variationId: item.variationId,
							},
							() => {},
							item?.cartId,
							dispatch,
							'details',
						);
						setIsChangeModeAddCart(false);
						setIsClick(false);
					},
					(loading) => {
						setIsLoadingUpdateQuantity(loading);
					},
				);
			}, 500),
		).current;

		const handleAddCartWithModeMulti = (type: TypeAddCartWithMultiQuantity) => {
			!isClick ? setIsClick(true) : null;
			if (type === 'plus') {
				if (quantityAddCart + 1 === 1) {
					handleAddItemCart(
						router,
						dispatch,
						{
							cartId,
							isBuyNow: false,
							itemPromotionIds: productDetails?.firstVariationPromotions?.promotions,
							merchantId: productDetails?.merchant?.merchantId,
							productId: productDetails.id,
							brandId: productDetails.brandId,
							// profileId:authSelector?.id,
							variationId: idVariant!,
						},
						(status) => {
							setIsChangeModeAddCart(status);
						},
					);
				} else {
					deBounceUpdateOnClickQuantity({
						cartId,
						quantity: quantityAddCart + 1,
						merchantId: productDetails?.merchant?.merchantId,
						productId: productDetails.id,
						brandId: productDetails.brandId,
						variationId: idVariant!,
					});
				}
				setQuantityAddCart(quantityAddCart + 1);
			}
			if (type === 'minus') {
				deBounceUpdateOnClickQuantity({
					cartId,
					quantity: quantityAddCart - 1,
					merchantId: productDetails?.merchant?.merchantId,
					productId: productDetails.id,
					brandId: productDetails.brandId,
					variationId: idVariant!,
				});
				setQuantityAddCart(quantityAddCart - 1);
			}
		};

		return forMobile?.isMobile ? (
			<div
				className={classNames([
					'bottom-0 mx-auto flex h-auto w-full justify-between bg-white z-[50] animation-300',
					forMobile?.isChangeLayoutBuyNow && forMobile?.isMobile
						? 'showRisingUp'
						: 'showRisingDown',
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
				ref={ref}
				style={{ position: forMobile?.isMobile && 'sticky' }}
			>
				{forMobile?.isChangeLayoutBuyNow ? (
					<div className='border-r border-t border-[#E0E0E0] p-4 font-sfpro_bold font-semibold transition-all duration-300 hover:bg-opacity-80'>
						<div className='flex items-center'>
							<div className='relative h-6 w-6 overflow-hidden rounded-full'>
								<ImageCustom
									alt='vuivui merchant'
									layout='fill'
									src={productDetails?.merchant?.avatarImage}
								/>
							</div>
							<span
								className='block pl-1.5'
								onClick={() => handleOpenChat()}
								onKeyPress={() => handleOpenChat()}
								tabIndex={0}
								role={'button'}
							>
								Chat
							</span>
						</div>
					</div>
				) : null}

				{isChangeModeAddCart && quantityAddCart > 0 ? (
					<div
						className={classNames([
							'border-t border-[#E0E0E0] flex items-center px-4 py-[4px] min-h-[48px] flex-auto',
							isLoadingUpdateQuantity && 'pointer-events-none opacity-70',
						])}
					>
						<span
							className='bg-[#FB6E2E] text-white px-5 h-full flex items-center rounded-l cursor-pointer'
							onClick={() => handleAddCartWithModeMulti('minus')}
							onKeyPress={() => handleAddCartWithModeMulti('minus')}
							tabIndex={0}
							role={'button'}
						>
							-
						</span>
						<div className='bg-[#FDF6F4] text-[rgb(51,51,51)] w-full h-full justify-center flex items-center font-medium font-sfpro_semiBold uppercase'>
							Đã chọn {quantityAddCart}
						</div>
						<span
							className='bg-[#FB6E2E] text-white px-5 h-full flex items-center rounded-r cursor-pointer'
							onClick={() => handleAddCartWithModeMulti('plus')}
							onKeyPress={() => handleAddCartWithModeMulti('plus')}
							tabIndex={0}
							role={'button'}
						>
							+
						</span>
					</div>
				) : (
					<>
						<button
							className={classNames([
								'border-t border-[#E0E0E0] font-sfpro_bold font-semibold p-4 lg:hover:bg-opacity-80 lg:transition-all lg:duration-300',
								disableBuy ? 'grayscale pointer-events-none' : '',
								isClick ? 'pointer-events-none' : '',
								!forMobile?.isChangeLayoutBuyNow && 'flex-[50%] max-w-[50%]',
							])}
							onClick={() => {
								onSubmit?.();
								scrollToVariant?.scrollIntoView({
									behavior: 'smooth',
									block: 'center',
								});
								if (isValidSubmit && idVariant) {
									setIsChangeModeAddCart(true);
									handleAddCartWithModeMulti('plus');
								}
							}}
						>
							<div className='flex items-center justify-center'>
								<div className='relative h-6 w-6'>
									<img alt='vuivui cart' src='/static/svg/cart-profile-detail.svg' />
								</div>
								<span className='animation-300 block pl-1.5 font-sfpro_semiBold text-16 group-hover:text-pink-F05A94'>
									Thêm vào giỏ
								</span>
							</div>
						</button>
						<button
							className={classNames([
								'uppercase bg-[#FB6E2E] text-white py-[14px] flex-auto hover:bg-opacity-80 animation-300',
								disableBuy ? 'grayscale pointer-events-none' : '',
							])}
							onClick={() => {
								onSubmit?.();
								isValidSubmit &&
									idVariant &&
									handleAddItemCart(router, dispatch, {
										cartId,
										isBuyNow: true,
										itemPromotionIds: productDetails?.firstVariationPromotions?.promotions,
										merchantId: productDetails?.merchant?.merchantId,
										productId: productDetails.id,
										brandId: productDetails.brandId,
										variationId: idVariant,
									});
							}}
						>
							Mua ngay
						</button>
					</>
				)}
			</div>
		) : (
			<div
				className={classNames([
					'mt-4 flex flex-wrap justify-between',
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
			>
				<div className='border-[#E0E0E0] border p-4 flex items-center font-sfpro_bold font-semibold transition-all duration-300 hover:bg-opacity-80'>
					<div className='relative h-6 w-6 overflow-hidden rounded-full'>
						<img alt='vuivui merchant' src={productDetails?.merchant?.avatarImage} />
					</div>
					<span
						className='block pl-1.5'
						onClick={() => handleOpenChat()}
						onKeyPress={() => handleOpenChat()}
						tabIndex={0}
						role={'button'}
					>
						Chat
					</span>
				</div>
				{isChangeModeAddCart && quantityAddCart > 0 ? (
					<div
						className={classNames([
							'border-[#E0E0E0] border-y border-r flex items-center px-4 py-[4px] flex-auto',
							isLoadingUpdateQuantity && 'pointer-events-none opacity-70',
						])}
					>
						<span
							className='bg-[#FB6E2E] text-white px-5 h-full flex items-center rounded-l cursor-pointer'
							onClick={() => handleAddCartWithModeMulti('minus')}
							onKeyPress={() => handleAddCartWithModeMulti('minus')}
							tabIndex={0}
							role={'button'}
						>
							-
						</span>
						<div className='bg-[#FDF6F4] text-[rgb(51,51,51)] w-full h-full justify-center flex items-center font-medium font-sfpro_semiBold uppercase'>
							Đã chọn {quantityAddCart}
						</div>
						<span
							className='bg-[#FB6E2E] text-white px-5 h-full flex items-center rounded-r cursor-pointer'
							onClick={() => handleAddCartWithModeMulti('plus')}
							onKeyPress={() => handleAddCartWithModeMulti('plus')}
							tabIndex={0}
							role={'button'}
						>
							+
						</span>
					</div>
				) : (
					<>
						<button
							className={classNames([
								'border-[#E0E0E0] border-r border-y group font-sfpro_bold font-semibold p-4 hover:bg-opacity-80 transition-all duration-300',
								disableBuy ? 'grayscale pointer-events-none' : '',
								isClick ? 'pointer-events-none' : '',
							])}
							onClick={() => {
								if (isValidSubmit && idVariant) {
									setIsChangeModeAddCart(true);
									handleAddCartWithModeMulti('plus');
								}
							}}
						>
							<div className='flex items-center'>
								<div className='relative h-6 w-6'>
									<img alt='vuivui cart' src='/static/svg/cart-profile-detail.svg' />
								</div>
								<span className='animation-300 block pl-1.5 group-hover:text-pink-F05A94'>
									Thêm vào giỏ
								</span>
							</div>
						</button>
						<button
							className={classNames([
								'flex-auto bg-[#FB6E2E] text-white py-4 px-11 font-semibold hover:bg-opacity-80 animation-300',
								disableBuy ? 'grayscale pointer-events-none' : '',
							])}
							onClick={() =>
								isValidSubmit &&
								idVariant &&
								handleAddItemCart(router, dispatch, {
									cartId,
									isBuyNow: true,
									itemPromotionIds: productDetails?.firstVariationPromotions?.promotions,
									merchantId: productDetails?.merchant?.merchantId,
									productId: productDetails.id,
									brandId: productDetails.brandId,
									variationId: idVariant,
								})
							}
						>
							Mua ngay
						</button>
					</>
				)}
			</div>
		);
	},
);

//render block countDown promotion
export const RenderCountDownPromotion: React.FC<FncBlockCountDownPromotion> = ({
	promotionType,
	isEnabledWithTimeSlot,
	info,
	mode,
	dateForPromotion,
}) => {
	const [days, hours, minutes, seconds] = useCountdown(dateForPromotion?.endDate);

	const countDownElement = [
		// {
		// 	times: days,
		// 	title: 'Ngày',
		// },
		{
			times: hours,
			title: 'giờ',
		},
		{
			times: minutes,
			title: 'phút',
		},
		{
			times: seconds,
			title: 'giây',
		},
	];

	const caseShowingPromotion = () => {
		switch (isEnabledWithTimeSlot) {
			case PROMOTION_STATUS_SHOW.RUNNING:
				return (
					<div
						className={classNames([
							'w-full bg-[#FDF6F4] py-2 px-3 text-13 leading-4 animation-100 mb-[14px] text-[#D1664A] overflow-hidden',
							days + hours + minutes + seconds > 0
								? 'opacity-100 visible block'
								: 'opacity-0 invisible hidden',
							days + hours + minutes + seconds <= 0 ? 'h-0' : 'h-[48px]',
						])}
					>
						<div className='flex items-center'>
							<Icon
								name={IconEnum.Alarm}
								color={'#D1664A'}
								// fill={'#D1664A'}
								styleIcon={{ marginRight: '6px' }}
							/>
							<span>Giảm sốc kết thúc sau : </span>
							<span className='font-sfpro_semiBold font-semibold ml-1 inline-block'>
								{countDownElement?.map((ele) =>
									ele?.times > 0
										? `${ele?.times < 10 ? `0${ele?.times}` : ele?.times} ${ele?.title} ${''}`
										: '',
								)}
							</span>
						</div>
					</div>
				);
			case PROMOTION_STATUS_SHOW.COMING_SOON:
				const today = moment().valueOf();
				return (
					<div className='w-full bg-[#FDF6F4] py-2 px-[30px] text-13 leading-4 mb-[14px] text-[#FB6E2E]'>
						<span className='text-16'>
							Deal sốc {formatTime(dateForPromotion?.startDate, 'H')}h{' '}
							{moment(dateForPromotion?.startDate)?.isSame(today, 'd') ? 'Hôm nay' : 'Ngày mai'}
						</span>
						<div className='flex items-center justify-between mt-4'>
							<div className='flex flex-col'>
								<span className='text-[#000000] font-bold leading-5 text-18 font-sfpro_semiBold'>
									{info?.pricePromote?.toLocaleString('it-IT')}
									<sup>đ</sup>
								</span>
								<div className='flex items-center gap-1'>
									<span className='text-[#727272] text-16 leading-5 line-through'>
										{info?.price?.toLocaleString('it-IT')}
									</span>
									<RenderTagTypePromotion
										discountValue={info?.discountValue!}
										promotionType={promotionType}
									/>
								</div>
							</div>
							<div>
								<button className='border bg-white text-[#333333] px-6 py-[6px]'>Nhắc nhở</button>
							</div>
						</div>
					</div>
				);
			default:
				return <></>;
		}
	};

	return mode && mode === MODE_RUNNER.PREVIEW_PROMOTION ? (
		<div
			className={classNames([
				'w-full bg-[#FDF6F4] py-2 px-3 text-13 leading-4 animation-100 mb-[14px] text-[#D1664A] overflow-hidden',
			])}
		>
			<div className='flex items-center'>
				<Icon
					name={IconEnum.Alarm}
					color={'#D1664A'}
					// fill={'#D1664A'}
					styleIcon={{ marginRight: '6px' }}
				/>
				<span>Giảm sốc kết thúc sau : </span>
				<span className='font-sfpro_semiBold font-semibold ml-1 inline-block'>
					1 Giờ 59 phút 59 giây
				</span>
			</div>
		</div>
	) : promotionType === TYPE_DISCOUNT.FLASH_SALE ? (
		caseShowingPromotion()
	) : null;
};
