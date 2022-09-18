import classNames from 'classnames';
import { useAppSelector } from 'hooks';
import { TypeActionShippingAddress } from 'models';
import React from 'react';

import { addressSelector } from '@/store/reducers/address';

import { ButtonBuyNowProps } from '../types';
import AnimationLoadingBounce from './AnimationBounce';

interface RenderButtonWithAction {
	condition: ButtonBuyNowProps;
	isAction: TypeActionShippingAddress;
	isValidForms: boolean;
	className?: string;
	suffixCurrencyTotal?: number;
	isPreviewOrderDetail?: boolean;
	onPreview?: () => void;
	isLoading?: boolean;
}

interface RenderNotAllowedButton {
	children: React.ReactNode;
	className?: string;
	extraCondition: boolean | string | undefined;
}

const RenderNotAllowedButton: React.FC<RenderNotAllowedButton> = ({
	children,
	extraCondition,
	className,
}) => (
	<div
		className={classNames([
			extraCondition ? 'cursor-not-allowed' : '',
			className ?? 'h-auto w-full',
			'mb-[9px]',
		])}
	>
		{children}
	</div>
);

export const RenderButtonWithAction: React.FC<RenderButtonWithAction> = ({
	condition,
	isAction,
	isValidForms,
	isLoading,
	className,
	suffixCurrencyTotal,
	isPreviewOrderDetail = false,
	onPreview = () => {},
}) => {
	const conditionDisabled =
		!condition?.hasProfile ||
		!condition?.hasChooseDelivery ||
		!condition?.activeActionCurrentSubmit ||
		(condition?.hasExistedBuyLater && !condition?.cartItemNotExisted) ||
		!condition.hasPaymentTypeEnable;

	const shippingTypeAddressSelector = useAppSelector(addressSelector);

	return (
		<React.Fragment>
			{isPreviewOrderDetail ? (
				<RenderNotAllowedButton extraCondition={isLoading}>
					<button
						className={classNames([
							'h-[51px] w-full rounded-md bg-[#FB6E2E] flex items-center justify-between px-7',
							isLoading && 'pointer-events-none opacity-70',
							className,
						])}
						onClick={onPreview}
					>
						<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
							{` Đặt hàng & Thanh toán`}
						</span>
						{isLoading ? (
							<AnimationLoadingBounce />
						) : (
							<>
								{suffixCurrencyTotal && suffixCurrencyTotal > 0 ? (
									<span className='items-center text-center font-sfpro text-[14px] font-normal not-italic text-white'>
										{suffixCurrencyTotal?.toLocaleString('it-IT')}
										<sup>đ</sup>
									</span>
								) : null}
							</>
						)}
					</button>
				</RenderNotAllowedButton>
			) : (
				<>
					{condition?.hasProfile ? (
						<>
							{isAction.action === 'CREATE' && (
								<RenderNotAllowedButton extraCondition={isValidForms}>
									<button
										disabled={isAction.action === 'CREATE' && isValidForms}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px]',
											isAction.action === 'CREATE' &&
												isValidForms &&
												'filter grayscale pointer-events-none',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											{shippingTypeAddressSelector?.typePickupAddress === 'homeDelivery'
												? 'Giao đến địa chỉ này'
												: 'Đến nhận hàng tại địa chỉ này'}
										</span>
									</button>
								</RenderNotAllowedButton>
							)}

							{condition?.activeActionCurrentSubmit &&
								condition.cartItemNotExisted &&
								condition.hasPaymentTypeEnable && (
									<RenderNotAllowedButton extraCondition={conditionDisabled ?? isLoading}>
										<button
											className={classNames([
												'h-[51px] w-full rounded-md bg-[#FB6E2E] flex items-center justify-between px-7',
												!condition?.hasChooseDelivery && 'filter grayscale pointer-events-none',
												isLoading && 'pointer-events-none opacity-70',
												className,
											])}
										>
											<span className='block w-full items-center text-left font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
												Hoàn tất đặt hàng
											</span>
											{isLoading ? (
												<AnimationLoadingBounce />
											) : (
												<>
													{suffixCurrencyTotal && suffixCurrencyTotal > 0 && (
														<span className='items-center text-center font-sfpro text-[14px] font-normal not-italic text-white'>
															{suffixCurrencyTotal?.toLocaleString('it-IT')}
															<sup>đ</sup>
														</span>
													)}
												</>
											)}
										</button>
									</RenderNotAllowedButton>
								)}

							{!condition.hasPaymentTypeEnable && condition.cartItemNotExisted && (
								<RenderNotAllowedButton extraCondition={conditionDisabled ?? isLoading}>
									<button
										disabled={conditionDisabled}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px]',
											conditionDisabled && 'filter grayscale pointer-events-none',
											isLoading && 'pointer-events-none opacity-70',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											Vui lòng chọn loại thanh toán khác
										</span>
										{isLoading ? <AnimationLoadingBounce /> : null}
									</button>
								</RenderNotAllowedButton>
							)}

							{((!isAction.isActiveOrder &&
								condition?.hasExistedBuyLater &&
								!condition?.cartItemNotExisted &&
								isAction.action !== 'CREATE') ??
								(!isAction.isActiveOrder &&
									condition?.hasExistedBuyLater &&
									!condition?.cartItemNotExisted &&
									isAction.action !== 'EDIT')) && (
								<RenderNotAllowedButton extraCondition={conditionDisabled}>
									<button
										disabled={conditionDisabled}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px]',
											conditionDisabled && 'filter grayscale pointer-events-none',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											{conditionDisabled
												? 'Vui lòng chọn sản phẩm để hoàn tất đặt hàng'
												: 'Hoàn tất đặt hàng'}
										</span>
									</button>
								</RenderNotAllowedButton>
							)}

							{isAction.action === 'EDIT' && (
								<RenderNotAllowedButton extraCondition={isValidForms}>
									<button
										disabled={isValidForms}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px] mb-[9px]',
											isValidForms && 'filter grayscale pointer-events-none',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											{shippingTypeAddressSelector?.typePickupAddress === 'homeDelivery'
												? 'Giao đến địa chỉ này'
												: 'Đến nhận hàng tại địa chỉ này'}
										</span>
									</button>
								</RenderNotAllowedButton>
							)}
						</>
					) : (
						<>
							{isAction.action === 'CREATE' ? (
								<RenderNotAllowedButton extraCondition={isValidForms}>
									<button
										disabled={isValidForms}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px] mb-[9px]',
											isValidForms && 'filter grayscale pointer-events-none',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											{shippingTypeAddressSelector?.typePickupAddress === 'homeDelivery'
												? 'Giao đến địa chỉ này'
												: 'Đến nhận hàng tại địa chỉ này'}
										</span>
									</button>
								</RenderNotAllowedButton>
							) : (
								<RenderNotAllowedButton extraCondition={isValidForms}>
									<button
										disabled={isValidForms}
										className={classNames([
											'bg-[#FB6E2E] rounded-md w-full h-[51px] mb-[9px]',
											isValidForms && 'filter grayscale pointer-events-none',
											className,
										])}
									>
										<span className='items-center text-center font-sfpro text-[14px] font-semibold uppercase not-italic text-white'>
											Hoàn thành
										</span>
									</button>
								</RenderNotAllowedButton>
							)}
						</>
					)}
				</>
			)}
		</React.Fragment>
	);
};
