import classNames from 'classnames';
import { IProductSearch } from 'models';
import { ReactNode, useEffect, useState } from 'react';
import { postProductLike } from 'services';

import { ProductCardLayout } from '@/components/Card/ProductCard/product-card-layout';
import { EmptyProduct } from '@/components/common';
import FilterBar from '@/components/FilterBar';
import Skeleton, { CardType } from '@/components/skeleton';
import getSelectorVariants from '@/hooks/useSelectorVariants';

const TOOLBARS_ID = {
	ONE: 1,
	TWO: 2,
};
interface IProduct {
	data?: Array<IProductSearch>;
	keyword?: string;
	loading?: boolean;
	setShowFilter?: (value: boolean) => void;
	isFilterHeader?: boolean;
	isCustomTitle?: boolean;
	className?: string;
	tabs?: any;
	onChangeTabs?: any;
	sortToolBar?: ReactNode;
	filterProperty?: () => ReactNode;
	type?: string;
	shopName?: string;
	isMobile?: boolean;
}

const ProductList: React.FC<IProduct> = ({
	data,
	keyword,
	setShowFilter,
	isFilterHeader,
	className,
	tabs,
	onChangeTabs,
	sortToolBar,
	filterProperty,
	type,
	shopName,
	isMobile,
}) => {
	// const dispatch = useAppDispatch();

	const toolbars = {
		1: { id: TOOLBARS_ID.ONE, title: 'Bộ lọc', path: '', icon: '/static/svg/filter-outlined.svg' },
	};

	const [screenWidth, setScreenWidth] = useState(0);

	const Skeletons = () => (
		<div
			className={classNames(
				isMobile
					? ['grid grid-cols-2 pb-9 gap-y-6 gap-x-1 bg-white pt-6']
					: ['grid grid-cols-4 pb-9 gap-y-6 gap-x-1 bg-white pt-6'],
			)}
		>
			{[...new Array(20)].map((_, index) => {
				return (
					<Skeleton
						key={index}
						cardType={CardType.square}
						type='card'
						width={'100%'}
						height={256}
						isDescription
					></Skeleton>
				);
			})}
		</div>
	);

	useEffect(() => {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}, []);

	function getNumberOfCard() {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}
	const setPath = (value: IProductSearch) => {
		return `/${value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : +'#'}`;
	};

	const displayToolBar = (id: number) => {
		if (!!toolbars[id]) {
			switch (id) {
				case TOOLBARS_ID.ONE:
					setShowFilter && setShowFilter(true);
					break;
				default:
					break;
			}
		}
	};

	screenWidth && window?.addEventListener('resize', getNumberOfCard);

	const handleLike = async (productId: number, isLike: boolean, preIsLike: boolean) => {
		if (isLike !== preIsLike) await postProductLike({ productId });
	};

	return (
		<div className={`container mx-auto ${className || ''}`}>
			{keyword && type !== 'shop' ? (
				<p
					className={classNames(
						['font-sfpro_bold text-3E3E40 uppercase'],
						isMobile ? 'text-16' : 'text-20',
					)}
				>
					KẾT QUẢ TÌM KIẾM CHO TỪ KHÓA{' '}
					{keyword !== '' ? <span className='uppercase text-F05A94'>{`"${keyword}"`}</span> : ''}
					{shopName !== '' ? (
						<span>
							<span> trong</span> <span className='uppercase text-F05A94'>{`${shopName}`}</span>{' '}
						</span>
					) : (
						''
					)}
				</p>
			) : (
				type !== 'shop' && (
					<div className='flex items-center justify-between md:border-b md:border-E7E7E8'>
						<FilterBar tabs={tabs} onChangeTab={onChangeTabs} />
						<div className='flex items-center justify-between gap-2'>
							<FilterBar toolbars={Object.values(toolbars)} onChooseTool={displayToolBar} />
							<FilterBar specificToolbar={sortToolBar} onChooseTool={displayToolBar} />
						</div>
					</div>
				)
			)}
			{filterProperty && filterProperty()}

			{data && Array.isArray(data) ? (
				<>
					<div>
						{data?.length ? (
							<div
								style={{ width: 'fit-content' }}
								className={classNames(['flex', 'flex-nowrap', 'overflow-x-auto'])}
							>
								{data?.map(({ ...item }, index) => {
									let values = getSelectorVariants({
										product: item as any,
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
											priceDash={
												values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0
											}
											percentDiscount={percentDiscount}
											type={item?.layoutType}
											title={item?.title}
											rating={{ rate: 3, total: item.totalRating }}
											propertyFeature={item?.propertyFeatured}
											brandName={item?.brandName}
											// listVariant={[...item?.variations]}
											image={item?.variations?.[0]?.variationImage}
											titlePomotion={titlePromotion}
											key={index}
											path={setPath(item)}
											variations={item?.variations}
											handleLike={(isLike) => {
												handleLike(item.id, isLike, item.isLike ? true : false);
											}}
											variationConfig={item?.variationConfigs?.configs}
											isHeart={item?.isLike}
											statusPromotion={values?.status}
											timeDealSock={values?.promotionDealSock?.remainDuration}
											moduleTypePromotion={values?.moduleType}
										/>
									);
								})}
							</div>
						) : (
							<EmptyProduct
								height={type === 'shop' ? 'h-[400px]' : ''}
								type={type ?? 'category'}
								title={type === 'shop' ? 'Không có sản phẩm' : 'Không có sản phẩm phù hợp'}
							/>
						)}
					</div>
				</>
			) : (
				<Skeletons />
			)}
		</div>
	);
};

export default ProductList;
