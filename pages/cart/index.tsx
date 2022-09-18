import { EmptyProduct, Head, Skeleton } from 'components';
import { DeviceType } from 'enums';
import { useAppCart, useAppSelector, useAppSWR } from 'hooks';
import { DefaultLayout } from 'layouts';
import { CartVariantItems, CustomerProfile, ICartPageProps, PaymentMethod } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';

import { Cart, CartMobile } from '@/modules/cart';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

export const LoadingSkeletons = ({ deviceType }: { deviceType: DeviceType }) => {
	switch (deviceType) {
		case DeviceType.MOBILE:
			return (
				<div className='container mx-auto pt-4'>
					<div className='flex flex-col justify-between'>
						<div className='py-4'>
							<Skeleton.Skeleton type='comment' lines={2} />
						</div>
						<div className='max-w-10/10 flex-10/10'>
							{[...new Array(4)].map((_: any, i: number) => (
								<div className='mb-4 rounded-md bg-white p-3' key={i}>
									<div className='flex w-full gap-3'>
										<div className='flex'>
											<Skeleton.Skeleton
												cardType={Skeleton.CardType.square}
												type='card'
												width={110}
												height={110}
											/>
										</div>
										<Skeleton.Skeleton lines={2} type='comment' />
									</div>
								</div>
							))}
							<div className='pt-4'>
								<Skeleton.Skeleton type='text' />
							</div>
						</div>
					</div>
				</div>
			);

		default:
			return (
				<div className='min-h-[88vh] bg-[#E5E5E5]'>
					<div className='container mx-auto pb-8 pt-6'>
						<div className='relative flex space-x-4'>
							<div className='max-w-[65%] flex-[65%]'>
								{[...new Array(3)].map((_: any, i: number) => (
									<div className='mb-4 rounded-md bg-white p-3' key={i}>
										<div className='flex w-full gap-3'>
											<div className='flex'>
												<Skeleton.Skeleton
													cardType={Skeleton.CardType.square}
													type='card'
													width={110}
													height={110}
												/>
											</div>
											<Skeleton.Skeleton lines={2} type='comment' />
										</div>
									</div>
								))}
							</div>

							<div className='max-w-[35%] flex-[35%] space-y-3'>
								<div className='top-[16px]'>
									<div className='rounded-md bg-white  p-3'>
										<Skeleton.Skeleton type='text' />
									</div>

									<div className='mt-4 rounded-md bg-white  p-3'>
										<Skeleton.Skeleton lines={4} type='comment' />
									</div>

									<div className='mt-4 rounded-md bg-white p-3'>
										<Skeleton.Skeleton lines={6} type='comment' />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
	}
};

const WrapperDeviceCart = ({
	children,
	deviceType,
}: {
	children: React.ReactNode;
	deviceType: DeviceType;
}) => {
	return deviceType === DeviceType.MOBILE ? (
		<>{children}</>
	) : (
		<DefaultLayout>{children}</DefaultLayout>
	);
};

const DynamicLoadingSkeletons = dynamic(() => Promise.resolve(LoadingSkeletons), {
	ssr: false,
});

const DynamicWrapperDeviceCart = dynamic(() => Promise.resolve(WrapperDeviceCart), {
	ssr: false,
});

const CartPage = () => {
	const deviceType = useAppSelector(deviceTypeSelector);
	const { cartId } = useAppCart();
	const [isLoading, setIsloading] = useState<boolean>(false);
	const { mutate } = useSWRConfig();

	const { data: dataItemsCart, isValidating: isValidItemsCart } = useAppSWR<
		ICartPageProps['dataCart']
	>(
		cartId
			? {
					method: 'GET',
					url: `/cart/${cartId}`,
			  }
			: null,
	);

	const { data: dataItemsCartsBuyLater, isValidating: isValidItemsCartBuyLater } = useAppSWR<
		ICartPageProps['dataCartBuyLater']
	>({
		method: 'GET',
		url: `/cartbuylater`,
	});

	const { data: dataCustomerProfiles } = useAppSWR<CustomerProfile[]>({
		url: '/profile',
		method: 'GET',
	});

	const { data: dataPaymentMethods } = useAppSWR<PaymentMethod[]>({
		url: `/payment/method`,
		method: 'GET',
	});

	const refLengthCartItems = useRef<number | undefined>(0);
	const lengthRequestItems = dataItemsCart?.cartItems?.reduce((prev: any, curr: any) => {
		return (prev = curr.items?.length);
	}, 0);

	useEffect(() => {
		if (refLengthCartItems.current !== lengthRequestItems) {
			setIsloading(true);
			refLengthCartItems.current = lengthRequestItems;
		}
		return setIsloading(false);
	}, [dataItemsCart?.cartItems, isValidItemsCart, lengthRequestItems]);

	return (
		<DynamicWrapperDeviceCart deviceType={deviceType}>
			<Head title={`Giỏ hàng | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`}></Head>
			{(!dataItemsCart?.cartItems?.length && isValidItemsCart) ||
			(isLoading && isValidItemsCart) ? (
				<DynamicLoadingSkeletons deviceType={deviceType} />
			) : +(dataItemsCart?.cartItems ?? [])?.length === 0 &&
			  +((dataItemsCartsBuyLater?.products ?? [])?.length === 0) &&
			  !isValidItemsCart ? (
				<EmptyProduct title='Không có sản phẩm nào trong giỏ hàng của bạn.' />
			) : (
				<>
					{deviceType === DeviceType.MOBILE ? (
						<CartMobile
							dataProfiles={dataCustomerProfiles}
							onMutable={mutate}
							dataCart={dataItemsCart}
							dataCartBuyLater={dataItemsCartsBuyLater}
							hasIsOutOfStock={Boolean(
								dataItemsCart?.cartItems
									?.reduce((prev: CartVariantItems[], curr) => {
										return (prev = curr.items);
									}, [])
									?.filter((ele) => ele.isOutOfStock).length === dataItemsCart?.cartItems?.length,
							)}
							paymentMethod={dataPaymentMethods}
							isLoading={{
								cartBuyNow: isValidItemsCart,
								cartBuyLater: isValidItemsCartBuyLater,
							}}
						/>
					) : (
						<Cart
							dataProfiles={dataCustomerProfiles}
							onMutable={mutate}
							dataCart={dataItemsCart}
							dataCartBuyLater={dataItemsCartsBuyLater}
							paymentMethod={dataPaymentMethods}
							hasIsOutOfStock={Boolean(
								dataItemsCart?.cartItems
									?.reduce((prev: CartVariantItems[], curr) => {
										return (prev = curr.items);
									}, [])
									?.filter((ele) => ele.isOutOfStock).length === dataItemsCart?.cartItems?.length,
							)}
							isLoading={{
								cartBuyNow:
									refLengthCartItems.current !==
										dataItemsCart?.cartItems?.reduce((prev: any, curr: any) => {
											return (prev = curr.items?.length);
										}, 0) && isValidItemsCart,
								cartBuyLater: isValidItemsCartBuyLater,
							}}
						/>
					)}
				</>
			)}
		</DynamicWrapperDeviceCart>
	);
};

export default CartPage;
