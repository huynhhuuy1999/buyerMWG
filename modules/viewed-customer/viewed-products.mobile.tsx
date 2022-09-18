import { Pagination } from 'components';
import { ProductCardLayout } from 'components/Card/ProductCard/product-card-layout';
import { IProductSearch, QueryParams } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const MAX_PAGE_SIZE = 8;

import MOCKUP_VIEW from './view-mokup.json';

const ViewedProducts: React.FC = () => {
	const router = useRouter();
	const [listFilter, setListFilter] = useState({});
	const [listViewed, setListViewed] = useState<IProductSearch[]>([]);
	const [pageIndex, setPageIndex] = useState<number>(Number(router?.query?.page) || 0);
	//const { data: responseData} = useViewedProduct({})
	const responseData: any = MOCKUP_VIEW;

	const renderParamURL = (listFilter: QueryParams, pageIndex?: number) => {
		setListFilter(listFilter);
		setPageIndex(pageIndex ? pageIndex : 0);
	};

	useEffect(() => {
		setListViewed(responseData.data);
	}, [responseData]);

	return (
		<div>
			<div className='text-[##333333] py-3 font-sfpro_bold text-lg font-bold uppercase'>
				Sản phẩm đã xem gần đây
			</div>
			<div className='rounded-lg bg-white px-4 pt-4'>
				<div className='p-2'>Waitting filter here...</div>
				<div className='flex flex-row flex-wrap py-2'>
					{listViewed &&
						listViewed
							.slice(0, MAX_PAGE_SIZE * (pageIndex + 1))
							.map((item: IProductSearch, index) => (
								<div key={index} className='h-full w-1/4 border'>
									<ProductCardLayout
										price={item.price}
										priceDash={item.priceTo}
										percentDiscount={item.promotions?.[0]?.pricePromote}
										title={item.title}
										type={1}
										rating={{ rate: item.averageStar, total: item.totalRating }}
										propertyFeature={item.propertyFeatured}
										isGuarantee={item.hasWarranty}
										path={`/${item.categoryUrlSlug}/${item.urlSlug}`}
										brandName={item.brandName}
										isHeart={item.isLike ? true : false}
										listVariant={item.variations}
										titlePomotion={item.promotions?.[0]?.titlePromotion}
										variations={item.variations}
										gift={'how'}
										timeFreeShip={40}
										priceOrigin={item?.price}
									/>
								</div>
							))}
				</div>
				<div>
					<div className='container pb-5'>
						<Pagination
							pageSize={MAX_PAGE_SIZE}
							totalObject={responseData.totalObject}
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
