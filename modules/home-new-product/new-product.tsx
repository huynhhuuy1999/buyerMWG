import { Button, LoadingSpin,ProductCardLayout, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { TYPE_LAYOUT_CARD } from 'enums';
import {
	getSelectorVariants,
	useAppDispatch,
	useAppSelector,
	useIsomorphicLayoutEffect,
	useNewProduct,
} from 'hooks';
import { ProductViewES, QueryParams } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getHomeProductNew, homeTracking, postProductLike } from 'services';

import { newProductsSelector, pageIndex, productActions } from '@/store/reducers/productSlice';

const PAGE_SIZE = 8;

const NewProduct = (props: any) => {
	const { query: queryRouter } = useRouter();

	const prods = useAppSelector(newProductsSelector) ?? [];

	const page = useAppSelector(pageIndex);

	const [loading, setLoading] = useState(false);

	const [click, setClick] = useState(false);

	const [query, setQuery] = useState<QueryParams>({ pageIndex: page, pageSize: PAGE_SIZE });

	const { data }: any = useNewProduct(props.data, {
		pageIndex: 0,
		pageSize: PAGE_SIZE,
	});
	const dispatch = useAppDispatch();

	///// define element div with id: new-product

	let newProduct: any = useRef();

	useEffect(() => {
		newProduct.current = global?.window?.document?.getElementById('new-product');
		setClick(false);
	}, []);

	// infinity scroll
	let lastScrollTop = 0;
	useIsomorphicLayoutEffect(() => {
		if (newProduct.current && !click && !loading) {
			const handleScrollWindow = () => {
				let windowHeight = global?.window?.innerHeight;
				var st = global?.window?.pageYOffset || global?.window?.document.documentElement.scrollTop;
				if (st > lastScrollTop && query?.pageIndex !== undefined && query?.pageIndex <= 2) {
					if (newProduct.current?.getBoundingClientRect()?.bottom - windowHeight < -80) {
						setLoading(true);
						setClick(true);
						setQuery({ ...query, pageIndex: (query.pageIndex += 1) });
					}
				}
				lastScrollTop = st <= 0 ? 0 : st;
			};

			window.addEventListener('scroll', handleScrollWindow);

			return () => window.removeEventListener('scroll', handleScrollWindow);
		}
	}, [newProduct.current, click, loading]);

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-5 gap-4 bg-white pb-9 pt-6'>
				{[...new Array(10)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							isDescription
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={'100%'}
							height={207}
						></Skeleton.Skeleton>
					);
				})}
			</div>
		);
	}, []);

	const fetchData = async (qr: QueryParams) => {
		if (query?.pageIndex !== undefined && query?.pageIndex > 0) {
			setLoading(true);
			try {
				let res = await getHomeProductNew({ ...qr, pageIndex: prods?.length / PAGE_SIZE });

				dispatch(productActions.setNewProducts({ products: res.data?.data }));
			} catch (error) {
				// console.log(error);
			} finally {
				setLoading(false);
				setClick(false);
				setTimeout(() => {
					!queryRouter?.bot_crawler &&
						query?.pageIndex !== undefined &&
						query.pageIndex > 3 &&
						global?.window?.scrollTo({
							top: window?.document.body.scrollHeight - 960,
							behavior: 'smooth',
						});
				}, 50);
			}
		}
	};

	useEffect(() => {
		click && loading && fetchData(query);
		dispatch(productActions.setPageIndex(query.pageIndex));
	}, [click, loading]);

	useIsomorphicLayoutEffect(() => {
		if (Array.isArray(data) && data?.length === PAGE_SIZE) {
			const payload = {
				products: data,
			};
			query.pageIndex === prods?.length / PAGE_SIZE &&
				dispatch(productActions.setNewProducts(payload));
		}
	}, [data]);

	//////
	const setPath = (value: ProductViewES) => {
		return `/${
			value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : 'coming-soon'
		}`;
	};

	const handleLike = async (productId: number, isLike: boolean, preIsLike: boolean) => {
		// if (isLike !== preIsLike)
		await postProductLike({ productId });
	};

	return (
		<div className='my-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex`}>
					<h2 className='font-sfpro_semiBold text-20 text-3E3E40 '>Sản phẩm mới</h2>
				</div>
				<div id='new-product' className='min-w-screen hide-scrollbar overflow-auto'>
					{Array.isArray(data) && data?.length > 0 && queryRouter?.bot_crawler ? (
						<>
							<div className='grid min-w-container grid-cols-4 gap-4 pt-6'>
								{data?.map(
									(
										item: (ProductViewES & ProductCardLayout.IProductCardLayout) | any,
										index: number,
									) => {
										let values = getSelectorVariants({
											product: item,
										});

										let titlePromotion = item?.promotions?.length
											? item?.promotions[0].titlePromotion
											: [];
										let percentDiscount = item?.promotions?.length
											? item?.promotions[0]?.promotionDealSock?.discountValue
											: 0;
										const numQuantitySock =
											item?.promotions?.[0]?.moduleType === 1
												? item?.promotions?.[0]?.totalQuantity
												: 0;

										return (
											<ProductCardLayout.ProductCardLayout
												type={TYPE_LAYOUT_CARD.DEFAULT}
												heightImage={264}
												widthImage={264}
												price={values?.pricePromote || values?.price}
												priceDash={
													values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0
												}
												percentDiscount={percentDiscount}
												title={item?.title}
												rating={{ rate: 3, total: item.totalRating }}
												propertyFeature={item?.propertyFeatured}
												brandName={item?.brandName}
												listVariant={[...item?.variations]}
												image={
													item?.variations?.length
														? item?.variations?.[0]?.variationImage
														: EmptyImage
												}
												titlePomotion={titlePromotion}
												key={index}
												path={setPath(item)}
												variations={item?.variations}
												handleLike={(isLike) => {
													handleLike(item.id, isLike, !!item.isLike);
												}}
												variationConfig={item?.variationConfigs?.configs}
												isHeart={item?.isLike}
												onClick={() => {
													homeTracking(12);
												}}
												numQuantityDealShock={numQuantitySock}
												statusPromotion={values?.status}
												timeDealSock={values?.promotionDealSock?.remainDuration}
												isGuarantee={item.merchant?.type === 3}
												categoryUrlSlug={item?.categoryUrlSlug}
												configRemainQuantity={values?.configRemainQuantity || 0}
												priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
												moduleTypePromotion={values?.moduleType}
											/>
										);
									},
								)}
							</div>
							<div className='grid min-w-container grid-cols-4 gap-4 pt-6'>
								{(prods?.length <= 8 ? [] : [...(prods.slice(8, prods?.length) || [])])?.map(
									(
										item: (ProductViewES & ProductCardLayout.IProductCardLayout) | any,
										index: number,
									) => {
										let values = getSelectorVariants({
											product: item,
										});
										let titlePromotion = item?.promotions?.length
											? item?.promotions[0].titlePromotion
											: [];
										let percentDiscount = item?.promotions?.length
											? item?.promotions[0]?.promotionDealSock?.discountValue
											: 0;

										const numQuantitySock =
											item?.promotions?.[0]?.moduleType === 1
												? item?.promotions?.[0]?.totalQuantity
												: 0;

										return (
											<ProductCardLayout.ProductCardLayout
												heightImage={264}
												widthImage={264}
												price={values?.pricePromote || values?.price || item?.price}
												priceDash={
													values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0
												}
												percentDiscount={percentDiscount}
												type={TYPE_LAYOUT_CARD.DEFAULT}
												title={item?.title}
												rating={{ rate: 3, total: item.totalRating }}
												propertyFeature={item?.propertyFeatured}
												brandName={item?.brandName}
												listVariant={[...item?.variations]}
												image={
													item?.variations?.length
														? item?.variations?.[0]?.variationImage
														: EmptyImage
												}
												titlePomotion={titlePromotion}
												key={index}
												path={setPath(item)}
												variations={item?.variations}
												handleLike={(isLike) => {
													handleLike(item.id, isLike, !!item.isLike);
												}}
												variationConfig={item?.variationConfigs?.configs}
												isHeart={item?.isLike}
												onClick={() => {
													homeTracking(12);
												}}
												numQuantityDealShock={numQuantitySock}
												statusPromotion={values?.status}
												timeDealSock={values?.promotionDealSock?.remainDuration}
												isGuarantee={item.merchant?.type === 3}
												categoryUrlSlug={item?.categoryUrlSlug}
												configRemainQuantity={values?.configRemainQuantity || 0}
												priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
												moduleTypePromotion={values?.moduleType}
											/>
										);
									},
								)}
							</div>
						</>
					) : prods?.length > 0 ? (
						<div className='grid min-w-container grid-cols-4 gap-4 pt-6'>
							{prods?.map(
								(
									item: (ProductViewES & ProductCardLayout.IProductCardLayout) | any,
									index: number,
								) => {
									let values = getSelectorVariants({
										product: item,
									});
									let titlePromotion = item?.promotions?.length
										? item?.promotions[0].titlePromotion
										: [];

									const percentDiscount = item?.promotions?.length
										? item?.promotions[0].discountValue
										: 0;

									const numQuantitySock =
										item?.promotions?.[0]?.moduleType === 1
											? item?.promotions?.[0]?.totalQuantity
											: 0;

									return (
										<ProductCardLayout.ProductCardLayout
											heightImage={264}
											widthImage={264}
											price={values?.pricePromote || values?.price || item?.price}
											priceDash={
												values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0
											}
											percentDiscount={percentDiscount}
											// type={item?.layoutType}
											type={TYPE_LAYOUT_CARD.DEFAULT}
											title={item?.title}
											rating={{ rate: 3, total: item.totalRating }}
											propertyFeature={item?.propertyFeatured}
											brandName={item?.brandName}
											listVariant={[...item?.variations]}
											image={
												item?.variations?.length
													? item?.variations?.[0]?.variationImage
													: EmptyImage
											}
											titlePomotion={titlePromotion}
											key={index}
											path={setPath(item)}
											variations={item?.variations}
											handleLike={(isLike) => {
												handleLike(item.id, isLike, !!item.isLike);
											}}
											variationConfig={item?.variationConfigs?.configs}
											isHeart={item?.isLike}
											onClick={() => {
												homeTracking(12);
											}}
											numQuantityDealShock={numQuantitySock}
											statusPromotion={values?.status}
											timeDealSock={values?.promotionDealSock?.remainDuration}
											isGuarantee={item.merchant?.type === 3}
											categoryUrlSlug={item?.categoryUrlSlug}
											configRemainQuantity={values?.configRemainQuantity || 0}
											priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
											moduleTypePromotion={values?.moduleType}
										/>
									);
								},
							)}
						</div>
					) : (
						Skeletons
					)}
				</div>
				{prods?.length >= 30 && query.pageIndex && query.pageIndex >= 3 ? (
					<div className='mt-4 flex justify-center'>
						<Button
							className='animation-200 w-40 justify-center rounded-md border border-F05A94 px-4 py-2 text-F05A94 hover:bg-F05A94 hover:text-white'
							onClick={() => {
								// query.pageIndex && dispatch(productActions.setPageIndex(query.pageIndex + 1));
								query.pageIndex && setQuery({ ...query, pageIndex: query.pageIndex + 1 });
								setLoading(true);
								setClick(true);
							}}
							disabled={loading}
						>
							{loading ? 'Đang tải . . .' : 'Xem thêm'}
						</Button>
					</div>
				) : loading ? (
					<div className='flex justify-center'>
						<LoadingSpin />
					</div>
				) : null}
			</div>
		</div>
	);
};

export default NewProduct;
