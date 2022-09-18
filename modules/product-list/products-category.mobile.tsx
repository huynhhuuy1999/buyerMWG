import { Skeleton, Spin } from 'components';
import { IProductSearch } from 'models';
import { NextPage } from 'next';
import { useEffect, useMemo, useRef } from 'react';
import { postProductLike } from 'services';

import { ProductCardLayout } from '@/components/Card/ProductCard/product-card-layout';
import getSelectorVariants from '@/hooks/useSelectorVariants';

interface IProductMobile {
	listProductSearchSWR?: any;
	loading?: boolean;
	setPage?: () => void;
	pageIndex: number;
}

const ProductCategoryMobile: NextPage<IProductMobile> = ({
	listProductSearchSWR: { data = [], totalPage },
	loading,
	setPage,
	pageIndex,
}) => {
	const isFetchData = useMemo(() => pageIndex <= totalPage, [pageIndex, totalPage]);
	const scroll_ref: any = useRef(null);
	const Skeletons = () => (
		<>
			{[...new Array(8)].map((_, index) => {
				return (
					<div key={index} className='mb-2'>
						<Skeleton.Skeleton
							cardType={Skeleton.CardType.square}
							type='card'
							width={'99%'}
							height={330}
							isDescription
						/>
					</div>
				);
			})}
		</>
	);

	const setPath = (value: IProductSearch) => {
		return `/${value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : +'#'}`;
	};

	useEffect(() => {
		const handleScrollFetchData = () => {
			if (scroll_ref && scroll_ref.current) {
				const isBottom =
					scroll_ref.current.scrollHeight - scroll_ref.current.scrollTop ===
					scroll_ref.current.clientHeight;
				if (isBottom && isFetchData) {
					setPage && setPage();
				}
			}
		};
		window.addEventListener('scroll', handleScrollFetchData);
		return () => window.removeEventListener('scroll', handleScrollFetchData);
	}, []);

	const handleLike = async (productId: number, isLike: boolean, preIsLike: boolean) => {
		if (isLike !== preIsLike) await postProductLike({ productId });
	};

	return (
		<div className='mt-[20px]'>
			<div ref={scroll_ref} className='grid grid-cols-2 bg-white'>
				{Array.isArray(data) ? (
					data.length ? (
						data?.map((product: any, indexProduct: number) => {
							const values = getSelectorVariants({
								product: product,
							});

							const titlePromotion = product?.promotions?.length
								? product?.promotions[0].titlePromotion
								: [];
							const percentDiscount = product?.promotions?.length
								? product?.promotions[0].discountValue
								: 0;
							return (
								<div key={indexProduct}>
									<ProductCardLayout
										price={values?.pricePromote || values?.price}
										priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
										percentDiscount={percentDiscount}
										type={product?.layoutType}
										title={product?.title}
										rating={{ rate: 3, total: 30 }}
										propertyFeature={product?.propertyFeatured}
										brandName={product?.brandName}
										listVariant={[...product?.variations]}
										image={product?.variations?.[0]?.variationImage}
										titlePomotion={titlePromotion}
										path={setPath(product)}
										isMobile={true}
										variations={product?.variations}
										variationConfig={product?.variationConfigs?.configs}
										isHeart={product?.isLike}
										handleLike={(isLike) => {
											handleLike(product.id, isLike, product.isLike ? true : false);
										}}
										heightImage={177}
										widthImage={177}
										statusPromotion={values?.status}
										timeDealSock={values?.promotionDealSock?.remainDuration}
										moduleTypePromotion={values?.moduleType}
										priceOrigin={product?.price}
									/>
								</div>
							);
						})
					) : null
				) : (
					<Skeletons />
				)}
			</div>
			{loading ? (
				<div className='flex justify-center'>
					<Spin size={40} />
				</div>
			) : null}
		</div>
	);
};

export default ProductCategoryMobile;
