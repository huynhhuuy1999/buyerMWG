import { PopupNotification, Skeleton, ViewList } from 'components';
import { InterParamsViewList } from 'components/ViewList';
import { useAppSelector } from 'hooks';
import { FilterCustomer, FilterProductFavorite } from 'modules';
import { useEffect, useState } from 'react';
import { postProductLike } from 'services';

import { ProductCardLayout } from '@/components/Card/ProductCard/product-card-layout';
import Portal from '@/HOCs/portal';
import getSelectorVariants from '@/hooks/useSelectorVariants';
import { getProductsLiked } from '@/services/product';
import { listAllCategorySelector } from '@/store/reducers/categorySlide';

const MAX_PAGE_SIZE = 8;

const defaultParams: InterParamsViewList = {
	pageIndex: 0,
	pageSize: MAX_PAGE_SIZE,
};

interface IActiveNotification {
	isShow: boolean;
	messages: string;
}
const WishListProducts = () => {
	const [activeNotification, setActiveNotification] = useState<IActiveNotification>({
		isShow: false,
		messages: 'Đã bỏ thích thành công !',
	});
	const [responseLiked, setResponseLiked] = useState<any>({
		data: [],
		pageSize: defaultParams.pageSize,
		page: defaultParams.page,
		totalObject: 0,
	});

	const categories = useAppSelector(listAllCategorySelector);
	const filter = new FilterProductFavorite({ categories });

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetchDataLiked();
	}, []);

	const fetchDataLiked = async (params: InterParamsViewList = defaultParams) => {
		try {
			const resp = await getProductsLiked(params);
			setLoading(false);
			setResponseLiked(resp);
		} catch (err) {
			setLoading(false);
		}
	};

	const handleChangePaging = (callback: any) => {
		setLoading(true);
		callback();
		window.scrollTo(0, 0);
	};

	const removeProductLiked = async (isLike: boolean, productId: number, merchantId: number) => {
		if (!isLike) {
			const resp = await postProductLike({ productId, merchantId });
			if (!resp.isError) {
				setActiveNotification((state: IActiveNotification) => ({ ...state, isShow: true }));
				fetchDataLiked();
			} else {
				setActiveNotification({
					messages: 'Bỏ thích không thành công',
					isShow: true,
				});
			}
		}
	};

	const propsViewList = {
		setItem: (item: any) => {
			const values = getSelectorVariants({
				product: item,
			});

			const titlePromotion = item?.promotions?.length ? item?.promotions[0].titlePromotion : [];
			const percentDiscount = item?.promotions?.length ? item?.promotions[0].discountValue : 0;

			return (
				<ProductCardLayout
					isHeart={item.isLike}
					heightImage={264}
					widthImage={192}
					price={values?.pricePromote || values?.price}
					priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
					percentDiscount={percentDiscount}
					type={item?.layoutType}
					title={item?.title}
					rating={{ rate: 3, total: 30 }}
					propertyFeature={item?.propertyFeatured}
					brandName={item?.brandName}
					listVariant={[...item?.variations]}
					variations={item.variations}
					titlePomotion={titlePromotion}
					path={`/${item.categoryUrlSlug ? item.categoryUrlSlug + '/' + item?.urlSlug : +'#'} `}
					handleLike={(isLike: boolean) => removeProductLiked(isLike, item.id, item.merchantId)}
					isChangeStyleHeart={false}
					statusPromotion={values?.status}
					timeDealSock={values?.promotionDealSock?.remainDuration}
					moduleTypePromotion={values?.moduleType}
					priceOrigin={item?.price}
				/>
			);
		},
		setLoadingCard: () => {
			return (
				<>
					{[...new Array(MAX_PAGE_SIZE)].map((_, index) => {
						return (
							<Skeleton.Skeleton
								key={index}
								cardType={Skeleton.CardType.square}
								type='card'
								width={201}
								height={264}
								isDescription
							></Skeleton.Skeleton>
						);
					})}
				</>
			);
		},
	};

	return (
		<>
			{false ?? <FilterCustomer listPropertyFilter={filter} />}
			<ViewList
				{...propsViewList}
				loading={loading}
				data={responseLiked.data}
				pageSize={responseLiked.pageSize}
				page={responseLiked.page}
				totalObject={responseLiked.totalObject}
				changePage={(value: InterParamsViewList) => {
					handleChangePaging(() => fetchDataLiked(value));
				}}
			/>
			{activeNotification.isShow && (
				<Portal>
					<PopupNotification
						message={activeNotification.messages}
						status={'SUCCESS'}
						isOpen={activeNotification.isShow}
						onClose={() => setActiveNotification((state) => ({ ...state, isShow: false }))}
					/>
				</Portal>
			)}
		</>
	);
};
export default WishListProducts;
