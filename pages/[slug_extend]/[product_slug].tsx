import { Head, Skeleton } from 'components';
import { DeviceType, MODE_RUNNER } from 'enums';
import {
	useAppDispatch,
	useAppSWR,
	useAppSWRInfinity,
	useIsomorphicLayoutEffect,
	useLastElement,
	useWindowDimensions,
} from 'hooks';
import { DefaultLayout, FullLayout } from 'layouts';
import { debounce } from 'lodash';
import { Product, ProductViewES, ShopInterface } from 'models';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { detectCrawler } from 'utils/crawlers-detect';
import { fetchingDataServer } from 'utils/requestServer';

import { ProductDetailDesktop, ProductDetailMobile } from '@/modules/product-detail';
import { productTracking } from '@/services/tracking';
import { wrapper } from '@/store/index';
import { productDetailActions } from '@/store/reducers/productDetailSlice';

type ContextParams = {
	product_slug: string;
	slug_extend: string;
};
interface PageProps {
	products: Product;
	mode: MODE_RUNNER;
	deviceType: DeviceType;
}

const LoadingSkeletons = ({ deviceType }: { deviceType: DeviceType }) => {
	switch (deviceType) {
		case DeviceType.MOBILE:
			return (
				<div className='container mx-auto pt-4'>
					<div className='flex flex-col justify-between'>
						<div className='mb-4 max-w-10/10 flex-10/10'>
							<Skeleton.Skeleton
								cardType={Skeleton.CardType.square}
								type='card'
								width={'100%'}
								height={'65vh'}
							/>
						</div>
						<div className='max-w-10/10 flex-10/10'>
							<Skeleton.Skeleton lines={2} type='comment' />
							<div className='mt-4 flex w-full items-center justify-start overflow-hidden'>
								{[...new Array(6)].map(
									(_: any, i: number) =>
										i < 6 && (
											<Skeleton.Skeleton
												cardType={Skeleton.CardType.square}
												type='card'
												key={i}
												width={60}
												height={60}
											/>
										),
								)}
							</div>
							<div className='pt-4'>
								<Skeleton.Skeleton type='text' />
							</div>
							<div className='mt-4 flex w-full items-center justify-start overflow-hidden'>
								{[...new Array(6)].map(
									(_: any, i: number) =>
										i < 6 && (
											<Skeleton.Skeleton
												cardType={Skeleton.CardType.square}
												type='card'
												key={i}
												width={60}
												height={60}
											/>
										),
								)}
							</div>
							<div className='pt-8'>
								<Skeleton.Skeleton
									cardType={Skeleton.CardType.square}
									type='card'
									width={'100%'}
									height={68}
								/>
							</div>
							<div className='pt-4'>
								<Skeleton.Skeleton lines={2} type='comment' />
							</div>
						</div>
					</div>
				</div>
			);

		default:
			return (
				<div className='container mx-auto pt-4'>
					<div className='flex justify-between'>
						<div className='max-w-[55%] flex-[55%]'>
							<div className='grid grid-cols-2 gap-2'>
								{[...new Array(4)].map((_: any, i: number) => (
									<div className='relative h-full w-full rounded-[3px] bg-[#f1f1f1]' key={i}>
										<Skeleton.Skeleton
											cardType={Skeleton.CardType.square}
											type='card'
											width={'100%'}
											height={'calc(50vh - 58px)'}
										/>
									</div>
								))}
							</div>
						</div>
						<div className='max-w-[45%] flex-[45%] pl-8'>
							<Skeleton.Skeleton lines={2} type='comment' />
							<div className='mt-4 flex w-full items-center justify-start gap-2 overflow-hidden'>
								{[...new Array(6)].map(
									(_: any, i: number) =>
										i < 6 && (
											<Skeleton.Skeleton
												cardType={Skeleton.CardType.square}
												type='card'
												key={i}
												width={60}
												height={60}
											/>
										),
								)}
							</div>
							<div className='pt-4'>
								<Skeleton.Skeleton type='text' />
							</div>
							<div className='mt-4 flex w-full items-center justify-start gap-2 overflow-hidden'>
								{[...new Array(6)].map(
									(_: any, i: number) =>
										i < 6 && (
											<Skeleton.Skeleton
												cardType={Skeleton.CardType.square}
												type='card'
												key={i}
												width={60}
												height={60}
											/>
										),
								)}
							</div>
							<div className='mt-8 bg-[#f1f1f1]'>
								<Skeleton.Skeleton
									cardType={Skeleton.CardType.square}
									type='card'
									width={'100%'}
									height={68}
								/>
							</div>
							<div className='pt-4'>
								<Skeleton.Skeleton lines={2} type='comment' />
							</div>
						</div>
					</div>
				</div>
			);
	}
};

const WrapperDevice = ({
	children,
	deviceType,
}: {
	children: React.ReactNode;
	deviceType: DeviceType;
}) => {
	return deviceType === DeviceType.MOBILE ? (
		<FullLayout>{children}</FullLayout>
	) : (
		<DefaultLayout>{children}</DefaultLayout>
	);
};

const ProductDetail = ({
	products,
	mode,
	deviceType,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { height } = useWindowDimensions();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [isActiveCall, setIsActiveCall] = useState<boolean>(false);

	const refProductDesktop = useRef<any>(React.createRef());

	const deBounceCallApi = useRef(
		debounce((height) => {
			handleCheckCallApiOther(height);
		}, 100),
	).current;

	const { data: productsUserAgent, error: productsUserAgentError } = useAppSWR<Product>(
		!products?.id
			? {
					url: `/product/${String(router.query?.product_slug)
						.split(/(pid-)/)
						.pop()}/detail`,
					method: 'GET',
			  }
			: '',
	);

	const { data: ratingStar } = useAppSWR<ProductViewES[]>(
		productsUserAgent?.id ?? products.id
			? { url: `/rating/star/${productsUserAgent?.id ?? products.id}`, method: 'GET' }
			: '',
	);

	const { data: infoMerchant } = useAppSWR<ShopInterface>(
		productsUserAgent?.merchant?.portalLink ?? products?.merchant?.portalLink
			? {
					url: `/merchant/info/${
						productsUserAgent?.merchant?.portalLink ?? products?.merchant?.portalLink
					}`,
					method: 'GET',
			  }
			: '',
	);

	useEffect(() => {
		if (productsUserAgent ?? products) {
			dispatch(
				productDetailActions.setProductBreadcrumb({
					name: productsUserAgent?.title ?? products.title,
					urlSlug: productsUserAgent?.urlSlug ?? products.urlSlug,
				}),
			);
		}

		dispatch(productDetailActions.clearImage(0));
	}, [dispatch, productsUserAgent, products]);

	const { data: productSimilar } = useAppSWR<ProductViewES[]>(
		(isActiveCall && (productsUserAgent?.id ?? products.id)) ||
			(deviceType === DeviceType.MOBILE && (productsUserAgent?.id ?? products.id))
			? { url: `/product/${productsUserAgent?.id ?? products.id}/similar`, method: 'GET' }
			: '',
	);

	const {
		data: productAlsoView,
		size,
		setSize,
		response,
		isValidating,
	} = useAppSWRInfinity<ProductViewES[]>(
		(isActiveCall && (productsUserAgent?.id ?? products.id)) ||
			(deviceType === DeviceType.MOBILE && (productsUserAgent?.id ?? products.id))
			? {
					request: {
						method: 'GET',
						url: `/product/${productsUserAgent?.id ?? products.id}/alsoview`,
					},
			  }
			: null,
		{ revalidateFirstPage: false },
	);

	const { lastElementRef } = useLastElement(isValidating, response?.totalRemain, () =>
		setSize(size + 1),
	);

	const handleCheckCallApiOther = (height: number) => {
		const prefixHeight = height + window.innerHeight / 2;
		const position = window.pageYOffset;

		switch (deviceType) {
			case DeviceType.DESKTOP:
				const condition = Boolean(
					refProductDesktop?.current?.clientHeight &&
						height &&
						position + prefixHeight >= refProductDesktop?.current?.clientHeight,
				);
				if (condition) {
					setIsActiveCall(true);
				}
				return false;

			case DeviceType.MOBILE:
				setIsActiveCall(true);
				return;

			default:
				return;
		}
	};

	useIsomorphicLayoutEffect(() => {
		window.addEventListener('scroll', () => deBounceCallApi(height));
		return () => window.removeEventListener('scroll', () => deBounceCallApi(height));
	}, [handleCheckCallApiOther]);

	useEffect(() => {
		if (!((!products.id && !productsUserAgent?.id) || productsUserAgentError)) {
			productTracking(products.id ?? productsUserAgent?.id);
		}
	}, [productsUserAgentError, products.id, productsUserAgent?.id]);

	return (
		<WrapperDevice deviceType={deviceType}>
			{(!products.id && !productsUserAgent?.id) || productsUserAgentError ? (
				<LoadingSkeletons deviceType={deviceType} />
			) : mode === MODE_RUNNER.PREVIEWING ||
			  productsUserAgent?.status === 3 ||
			  products?.status === 3 ? (
				<React.Fragment>
					<Head title={`${productsUserAgent?.title ?? products.title} | Vuivui`} />
					{deviceType === DeviceType.MOBILE ? (
						<ProductDetailMobile
							ref={lastElementRef}
							productDetails={productsUserAgent ?? products}
							ratingStar={ratingStar}
							infoMerchant={infoMerchant}
							mode={mode}
							options={{
								params: { typeSimilar: productSimilar, typeAlsoView: productAlsoView },
								isActive: isActiveCall,
								isValidating: isValidating,
								totalRemainAlsoView: response?.totalRemain,
							}}
						/>
					) : (
						<ProductDetailDesktop
							ref={refProductDesktop}
							productDetails={productsUserAgent ?? products}
							ratingStar={ratingStar}
							infoMerchant={infoMerchant}
							mode={mode}
							options={{
								params: { typeSimilar: productSimilar, typeAlsoView: productAlsoView },
								isActive: isActiveCall,
							}}
						/>
					)}
				</React.Fragment>
			) : (
				<></>
			)}
		</WrapperDevice>
	);
};

export default ProductDetail;

//----------------- VERSION 0.1.0 ----------

// export const getServerSideProps: GetServerSideProps<PageProps, ContextParams> = ;

export const getServerSideProps: GetServerSideProps<PageProps | any, ContextParams> =
	wrapper.getServerSideProps((store) => async (context) => {
		const deviceType = store?.getState()?.app?.device;

		const { req, res, query, params } = context;
		const isDetecting = detectCrawler(req?.headers?.['user-agent'] || '');

		const seoBotHeaders = req?.headers?.['seo-bot-request'];

		// // urlSlug -> hash string (pid - XXXX) -> split -> get id of this product -> call request
		const isSlugProduct = params?.product_slug as string;
		const regexIdProductDetail = Number(isSlugProduct?.split(/(pid-)/).pop());

		const isSlugCategory = params?.slug_extend;
		const previewModeKey = query?.previewKey; //for merchant preview page
		const previewModePromotionKey = query?.isPreview; //for merchant preview promotion page

		if (seoBotHeaders || isDetecting || query?.bot_crawler) {
			if (isSlugProduct && isSlugCategory) {
				try {
					res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

					const products = await fetchingDataServer({
						method: 'GET',
						url: `/product/${regexIdProductDetail}/detail`,
						configs: { req },
					});
					if (products.data && products.data?.status === 3) {
						return {
							props: {
								products: products.data,
								mode: MODE_RUNNER.PUBLIC,
								deviceType,
							},
							// revalidate: 60,
						};
					} else {
						return {
							notFound: true,
						};
					}
				} catch (error) {
					// redirect -> 404
					return {
						notFound: true,
					};
				}
			}
			return {
				notFound: true,
			};
		}

		if (previewModeKey) {
			if (isSlugProduct && isSlugCategory) {
				try {
					res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

					const products = await fetchingDataServer({
						method: 'GET',
						url: `/product/${regexIdProductDetail}/detail?previewKey=${previewModeKey}`,
						configs: { req },
					});

					if (products.data) {
						//data same times in one minutes || revalidate is default 60s
						return {
							props: {
								products: products.data,
								mode: MODE_RUNNER.PREVIEWING,
								deviceType,
							},
							// revalidate: 60,
						};
					}
					return {
						notFound: true,
					};
				} catch (error) {
					// redirect -> 404
					return {
						notFound: true,
					};
				}
			}
			return {
				notFound: true,
			};
		}

		if (previewModePromotionKey) {
			return {
				props: {
					products: {} as any,
					mode: MODE_RUNNER.PREVIEW_PROMOTION,
					deviceType,
				},
			};
		}

		return {
			props: {
				products: {} as any,
				mode: MODE_RUNNER.PUBLIC,
				deviceType,
			},
		};
	});
