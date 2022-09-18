import { ProductCardLayout } from 'components';
import { getSelectorVariants } from 'hooks';
import { ProductViewES } from 'models';
import { postProductLike } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';

interface IProductAlsoViewProps {
	options?: ProductViewES[];
}

const ProductAlsoView = ({ options }: IProductAlsoViewProps) => {
	const settings = {
		infinite: true,
		speed: 500,
		dots: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		nextArrow: () => (
			<div className='absolute right-3 top-[-30px] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon size={22} name={IconEnum.CaretRight} />
			</div>
		),
		hiddenPrev: true,
		classDivNext: 'w-full top-[50%] -translate-y-[50%]',
	};

	const handleLike = async (data: { productId: number; merchantId: number }) => {
		await postProductLike(data);
	};

	return (
		<Slider {...settings}>
			<div className='!grid min-w-container !grid-cols-4 gap-16px bg-white'>
				{(options || []).map((item: ProductViewES, index: number) => {
					let values = getSelectorVariants({
						product: item,
					});

					const titlePromotion = item?.promotions?.length ? item?.promotions[0].titlePromotion : [];

					let percentDiscount = item?.promotions?.length ? item?.promotions[0].discountValue : 0;
					let numQuantitySock =
						item?.promotions?.length &&
						item?.promotions?.[0].promotionDealSock &&
						item?.promotions?.[0]?.promotionDealSock?.quantity
							? item?.promotions?.[0]?.promotionDealSock?.quantity
							: 0;

					return (
						<ProductCardLayout.ProductCardLayout
							heightImage={263}
							widthImage={263}
							price={values?.pricePromote || values?.price}
							priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
							percentDiscount={percentDiscount}
							type={item?.layoutType}
							title={item?.title}
							rating={{ rate: item.averageRating, total: item.totalRating, isShow: true }}
							propertyFeature={item?.propertyFeatured}
							brandName={item?.brandName}
							listVariant={[...item?.variations]}
							image={item?.variations?.[0]?.variationImage}
							titlePomotion={titlePromotion}
							key={index}
							path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
							variations={item?.variations}
							handleLike={() => {
								handleLike({ productId: item.id, merchantId: item.merchantId });
							}}
							variationConfig={item?.variationConfigs?.configs}
							isHeart={item?.isLike}
							isGuarantee={item.merchant?.type === 3}
							categoryUrlSlug={item?.categoryUrlSlug}
							numQuantityDealShock={numQuantitySock}
							statusPromotion={values?.status}
							timeDealSock={values?.promotionDealSock?.remainDuration}
							configRemainQuantity={values?.configRemainQuantity || 0}
							priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
							moduleTypePromotion={values?.moduleType}
						/>
					);
				})}
			</div>
		</Slider>
	);
};

export default ProductAlsoView;
