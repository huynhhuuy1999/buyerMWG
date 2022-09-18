import { LoadingSpin, ProductCardLayout, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { CATEGORY_LAYOUT_TYPE, TYPE_LAYOUT_CARD } from 'enums';
import {
	getSelectorVariants,
	useAppDispatch,
	useAppSelector,
	useIsomorphicLayoutEffect,
	useNewProduct,
} from 'hooks';
import { IDetailVariationProduct, IProductSearch, ProductViewES, QueryParams } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	getDetailProductVariation,
	getHomeProductNew,
	homeTracking,
	postProductLike,
} from 'services';

import { IDrawerProduct } from '@/modules/drawerProduct/drawer-product.mobile';
import { newProductsSelector, pageIndex, productActions } from '@/store/reducers/productSlice';

const DrawerProduct = dynamic(
	() => import('@/modules/drawerProduct/drawer-product.mobile'),
) as React.FC<IDrawerProduct>;

const PAGE_SIZE = 10;

const NewProductMobile = (props: any) => {
	const { query: queryRouter } = useRouter();

	const prods = useAppSelector(newProductsSelector) ?? [];

	const page = useAppSelector(pageIndex);

	const [loading, setLoading] = useState(false);

	const [click, setClick] = useState(false);

	const [query, setQuery] = useState<QueryParams>({ pageIndex: page, pageSize: PAGE_SIZE });

	const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);

	const [detailVariation, setDetailVariation] = useState<IDetailVariationProduct[]>([]);

	const [productSelect, setProductSelect] = useState<any>({});

	const [infoVariantLastAddCart, setInfoVariantLastAddCart] = useState<any>({});

	const { data }: any = useNewProduct(props.data, {
		pageIndex: 0,
		pageSize: PAGE_SIZE,
	});
	const dispatch = useAppDispatch();

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
				if (st > lastScrollTop && query?.pageIndex !== undefined) {
					if (newProduct.current?.getBoundingClientRect()?.bottom - windowHeight < -20) {
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
			try {
				let res = await getHomeProductNew({ ...qr, pageIndex: prods?.length / PAGE_SIZE });

				dispatch(productActions.setNewProducts({ products: res.data?.data }));
			} catch (error) {
			} finally {
				setLoading(false);
				setClick(false);
			}
		}
	};

	useEffect(() => {
		click && loading && fetchData(query);
		dispatch(productActions.setPageIndex(query.pageIndex));
	}, [click, loading]);

	useEffect(() => {
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

	const handleShowVariant = async (product: IProductSearch) => {
		setIsShowDrawer(true);
		setProductSelect(product);
	};

	const onChooseVariant = async (productId: number, variationId: number) => {
		const respDetailVariation = await getDetailProductVariation({ productId, variationId });
		const copyDetailVariation = [...detailVariation];
		const indexCheck = copyDetailVariation.findIndex(
			(variation) => variation.productId === respDetailVariation.data.productId,
		);
		if (indexCheck !== -1) copyDetailVariation.splice(indexCheck, 1);
		copyDetailVariation.push(respDetailVariation.data);
		setDetailVariation(copyDetailVariation);
	};

	return (
		<div className='mt-1 mb-10 bg-white pt-4 pb-10'>
			<div className='mb-5'>
				<h2 className='border-b border-[#F6F6F6] px-2 pb-2  text-16 text-3E3E40'>Sản phẩm mới</h2>
				<div id='new-product' className='mb-2 flex flex-wrap justify-between'>
					{Array.isArray(data) && data?.length > 0 && queryRouter?.bot_crawler ? (
						<>
							<div className='grid grid-cols-2 gap-2 pt-6'>
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
											? item?.promotions[0].discountValue
											: 0;
										const numQuantitySock =
											item?.promotions?.[0]?.moduleType === 1
												? item?.promotions?.[0]?.totalQuantity
												: 0;
										return (
											<div className='border-inner flex-[50%]' key={index}>
												<ProductCardLayout.ProductCardLayout
													animation={false}
													heightImage={177}
													className='mx-auto'
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
													isMobile
													onShowMoreVariation={() => handleShowVariant(item)}
													onChooseVariant={onChooseVariant}
													statusPromotion={values?.status}
													timeDealSock={values?.promotionDealSock?.remainDuration}
													isGuarantee={item.merchant?.type === 3}
													categoryUrlSlug={item?.categoryUrlSlug}
													configRemainQuantity={values?.configRemainQuantity || 0}
													priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
													infoVariationAddCart={infoVariantLastAddCart}
													productId={item?.id}
													numQuantityDealShock={numQuantitySock}
													moduleTypePromotion={values?.moduleType}
													priceOrigin={item?.price}
												/>
											</div>
										);
									},
								)}
							</div>
							<div className='grid grid-cols-2 gap-2 pt-6'>
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
											? item?.promotions[0].discountValue
											: 0;
										const numQuantitySock =
											item?.promotions?.[0]?.moduleType === 1
												? item?.promotions?.[0]?.totalQuantity
												: 0;
										return (
											<div className='border-inner flex-[50%]' key={index}>
												<ProductCardLayout.ProductCardLayout
													animation={false}
													heightImage={177}
													className='mx-auto'
													price={values?.pricePromote || values?.price || item?.price}
													priceDash={
														values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0
													}
													percentDiscount={percentDiscount}
													type={TYPE_LAYOUT_CARD.DEFAULT}
													title={item?.title}
													rating={{
														rate: item.averageRating,
														total: item.totalRating,
														isShow: true,
													}}
													propertyFeature={item?.propertyFeatured}
													brandName={item?.brandName}
													listVariant={[...item?.variations]}
													image={
														item?.variations?.length
															? item?.variations?.[0]?.variationImage
															: EmptyImage
													}
													titlePomotion={titlePromotion}
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
													isMobile={true}
													onShowMoreVariation={() => handleShowVariant(item)}
													onChooseVariant={onChooseVariant}
													statusPromotion={values?.status}
													timeDealSock={values?.promotionDealSock?.remainDuration}
													isGuarantee={item.merchant?.type === 3}
													categoryUrlSlug={item?.categoryUrlSlug}
													configRemainQuantity={values?.configRemainQuantity || 0}
													priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
													infoVariationAddCart={infoVariantLastAddCart}
													numQuantityDealShock={numQuantitySock}
													productId={item?.id}
													moduleTypePromotion={values?.moduleType}
													priceOrigin={item?.price}
												/>
											</div>
										);
									},
								)}
							</div>
						</>
					) : prods?.length > 0 ? (
						<div className='flex flex-wrap justify-between'>
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
									let percentDiscount = item?.promotions?.length
										? item?.promotions[0].discountValue
										: 0;
									const numQuantitySock =
										item?.promotions?.[0]?.moduleType === 1
											? item?.promotions?.[0]?.totalQuantity
											: 0;

									return (
										<div className='border-inner flex-[50%]' key={index}>
											<ProductCardLayout.ProductCardLayout
												animation={false}
												heightImage={177}
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
												isMobile
												layoutType={CATEGORY_LAYOUT_TYPE.OPTION_TWO}
												onShowMoreVariation={() => handleShowVariant(item)}
												onChooseVariant={onChooseVariant}
												statusPromotion={values?.status}
												timeDealSock={values?.promotionDealSock?.remainDuration}
												numQuantityDealShock={numQuantitySock}
												isGuarantee={item.merchant?.type === 3}
												categoryUrlSlug={item?.categoryUrlSlug}
												configRemainQuantity={values?.configRemainQuantity || 0}
												priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
												infoVariationAddCart={infoVariantLastAddCart}
												productId={item?.id}
												moduleTypePromotion={values?.moduleType}
												priceOrigin={item?.price}
											/>
										</div>
									);
								},
							)}
						</div>
					) : (
						Skeletons
					)}
				</div>
				{loading ? (
					<div className='flex justify-center pt-2 pb-4'>
						<LoadingSpin />
					</div>
				) : (
					<div className='h-10'></div>
				)}

				<DrawerProduct
					isShowDrawer={isShowDrawer}
					setIsShowDrawer={(value) => setIsShowDrawer(value)}
					product={productSelect}
					getInfoVariantLastestAddCard={(value: any) => {
						setInfoVariantLastAddCart(value);
					}}
				/>
			</div>
		</div>
	);
};

export default NewProductMobile;
