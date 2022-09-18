import { Pagination } from 'components';
import { ProductCardLayout } from 'components/Card/ProductCard/product-card-layout';
import { useAppSelector, useViewedProduct } from 'hooks';
import { IProductSearch, QueryParams } from 'models';
import { FilterCustomer, FilterProductFavorite } from 'modules';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Skeleton, { CardType } from '@/components/skeleton';
import { listAllCategorySelector } from '@/store/reducers/categorySlide';

const MAX_PAGE_SIZE = 10;

const DynamicEmpty = dynamic(() => import('@/components/common/emptyProduct'), {
	ssr: false,
});
const ViewedProducts: React.FC = () => {
	const router = useRouter();

	const [listViewed, setListViewed] = useState<IProductSearch[]>([]);
	const [pageIndex, setPageIndex] = useState<number>(Number(router?.query?.page) || 0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [listFilter, setListFilter] = useState<QueryParams>({
		pageSize: MAX_PAGE_SIZE,
		pageIndex: pageIndex,
	});

	const { data: responseData, isValidating } = useViewedProduct(listFilter);
	const categories = useAppSelector(listAllCategorySelector);
	const filter = new FilterProductFavorite({ categories });

	const renderParamURL = (listFilter: QueryParams, pageIndex?: number) => {
		setListFilter(listFilter);
		setPageIndex(pageIndex ? pageIndex : 0);
	};
	useEffect(() => {
		setIsLoading(isValidating);
	}, [isValidating]);

	useEffect(() => {
		if (responseData) {
			setListViewed(responseData?.data);
		} else {
			setListViewed([]);
		}
	}, [responseData]);

	return (
		<div className='w-full'>
			<div>
				<div className='text-[##333333] w-full py-3 font-sfpro_bold text-lg font-bold uppercase'>
					Sản phẩm đã xem gần đây
				</div>
				<div className='w-full rounded-lg bg-white px-2'>
					<FilterCustomer listPropertyFilter={filter} />
					{!isLoading ? (
						listViewed?.length > 0 ? (
							<div className='mb-3 grid grid-cols-4 bg-white'>
								{listViewed.map((item: IProductSearch, index) => (
									<div key={index} className='flex items-start justify-center'>
										<ProductCardLayout
											price={item.price}
											priceDash={item.priceTo}
											percentDiscount={item.promotions?.[0]?.pricePromote}
											title={item.title}
											type={item.layoutType}
											rating={{ rate: item.averageStar, total: item.totalRating }}
											propertyFeature={item.propertyFeatured}
											isGuarantee={item.hasWarranty}
											path={`/${item.categoryUrlSlug}/${item.urlSlug}`}
											brandName={item.brandName}
											isHeart={item.isLike ? true : false}
											listVariant={item.variations}
											titlePomotion={item.promotions?.[0]?.titlePromotion}
											variations={item.variations}
											timeFreeShip={40}
											widthImage={200}
											heightImage={264}
										/>
									</div>
								))}{' '}
							</div>
						) : (
							<DynamicEmpty title='Không có sản phẩm nào trong giỏ hàng của bạn.' />
						)
					) : (
						<>
							<div className='grid grid-cols-4 pb-6'>
								{[...new Array(8)].map((_, index) => {
									return (
										<Skeleton
											key={index}
											cardType={CardType.square}
											type='card'
											width={200}
											height={220}
											isDescription
										/>
									);
								})}
							</div>
						</>
					)}
				</div>
				<div>
					<div className='container pb-5'>
						<Pagination
							pageSize={MAX_PAGE_SIZE}
							totalObject={responseData?.totalObject}
							page={pageIndex}
							onChange={(page, pageSize) => {
								renderParamURL(listFilter, page);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewedProducts;
