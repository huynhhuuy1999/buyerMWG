import { IProductSearch } from 'models';
import React, { useEffect, useState } from 'react';

import { ProductCardLayout } from '@/components/Card/ProductCard/product-card-layout';
import Pagination from '@/components/Pagination';
import Skeleton, { CardType } from '@/components/skeleton';
import { useRecommendProductList } from '@/hooks/useRecommendProductList';
import getSelectorVariants from '@/hooks/useSelectorVariants';
import { postProductLike } from '@/services/product';

const MAX_PAGE_SIZE = 20;

interface IRecommendProductList {
	keyword?: string;
	data?: any;
	isMobile?: boolean;
}

const RecommendProductList: React.FC<IRecommendProductList> = ({ keyword, data, isMobile }) => {
	const [pageIndex, setPageIndex] = useState(0);
	const {
		data: dataListProduct,
		// error,
		isValidating,
	} = useRecommendProductList(
		'/product/homefeature',
		{
			pageIndex: pageIndex,
			pageSize: MAX_PAGE_SIZE,
		},
		{ fallbackData: data },
	);

	const Skeletons = () => (
		<>
			{[...new Array(8)].map((_, index) => {
				return (
					<Skeleton
						key={index}
						cardType={CardType.square}
						type='card'
						width={256}
						height={256}
						isDescription
					></Skeleton>
				);
			})}
		</>
	);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [dataListProduct]);

	const setPath = (value: IProductSearch) => {
		return `/${value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : +'#'}`;
	};

	const handleLike = async (
		data: { productId: number; merchantId: number },
		isLike: boolean,
		preIsLike: boolean,
	) => {
		if (isLike !== preIsLike) await postProductLike(data);
	};

	return (
		<div className='container mx-auto pt-4'>
			<p>
				Chúng tôi không tìm thấy sản phẩm <b className='font-sfpro_bold'>{keyword}</b> nào.
			</p>
			{dataListProduct?.data?.data?.length ? (
				<p className='mt-2 font-sfpro_bold text-20 text-3E3E40'>SẢN PHẨM GỢI Ý</p>
			) : null}

			<div className='grid grid-cols-4 gap-y-6 gap-x-1 bg-white pb-9 pt-6'>
				{!isValidating ? (
					<>
						{dataListProduct?.data?.data?.length ? (
							dataListProduct?.data.data.map((item: any, index: number) => {
								let values = getSelectorVariants({
									product: item,
								});

								let titlePromotion = item?.promotions?.length
									? item?.promotions[0].titlePromotion
									: [];
								let percentDiscount = item?.promotions?.length
									? item?.promotions[0].discountValue
									: 0;
								return (
									<ProductCardLayout
										heightImage={isMobile ? 177 : 263}
										widthImage={isMobile ? 177 : 263}
										price={values?.pricePromote || values?.price}
										priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
										percentDiscount={percentDiscount}
										type={item?.layoutType}
										title={item?.title}
										rating={{ rate: 3, total: item.totalRating }}
										propertyFeature={item?.propertyFeatured}
										brandName={item?.brandName}
										listVariant={[...item?.variations]}
										image={item?.variations?.[0]?.variationImage}
										titlePomotion={titlePromotion}
										key={index}
										path={setPath(item)}
										variations={item?.variations}
										isHeart={item?.isLike}
										variationConfig={item?.variationConfigs?.configs}
										handleLike={(isLike) => {
											handleLike(
												{ productId: item.id, merchantId: item.merchantId },
												isLike,
												item.isLike ? true : false,
											);
										}}
										statusPromotion={values?.status}
										timeDealSock={values?.promotionDealSock?.remainDuration}
										moduleTypePromotion={values?.moduleType}
									/>
								);
							})
						) : (
							<div className='h-[70vh]' />
						)}
					</>
				) : (
					<Skeletons />
				)}
			</div>
			{!isValidating ? (
				<Pagination
					pageSize={MAX_PAGE_SIZE}
					totalObject={
						(dataListProduct?.data?.totalRemain || 0) +
						MAX_PAGE_SIZE * pageIndex +
						dataListProduct?.data?.data?.length
					}
					className='pb-5'
					page={pageIndex || 0}
					onChange={(pageIndex, pageSize) => setPageIndex && setPageIndex(pageIndex)}
				/>
			) : null}
		</div>
	);
};

export default RecommendProductList;
