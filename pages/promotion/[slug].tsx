// import { exportHTML } from 'utils';
import { Head, ProductDetailCard } from 'components';
import { DeviceType, TYPE_DISCOUNT } from 'enums';
import { getSelectorVariants, useAppSelector, useIsomorphicLayoutEffect } from 'hooks';
import DOMPurify from 'isomorphic-dompurify';
import { DefaultLayout, DefaultLayoutMobile } from 'layouts';
import { NextPageWithLayout, ProductViewES, PromotionStaticResponse } from 'models';
// import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { getListProductByVariationIdsApi, getPromotionStatic } from 'services';
import { deviceTypeSelector } from 'store/reducers/appSlice';
import { Icon, IconEnum } from 'vuivui-icons';

const tempId = '09fec319-122f-497d-a936-504409db8990';
const PromotionPage: NextPageWithLayout = ({ title = 'Khuyến mãi', data = '' }: any) => {
	// const { query } = useRouter();

	const [productList, setProductList] = useState([]);

	const [scrollDetect, setScrollDetect] = useState(0);

	const [htmlString, setHtmlString] = useState('');

	const sliderRef: any = useRef(null);

	const deviceType = useAppSelector(deviceTypeSelector);

	const style = `
			.u_body {
			}

			.u_row {
				display: flex;
				flex-wrap: nowrap;
				margin: 0 auto;
			}

			.u_column {
				position: relative;
				width: 100%;
				padding-right: 0;
				padding-left: 0;
			}
		`;

	const tempSessions = {
		vouchers: [
			{
				programId: '06d8a1ed-98b5-4b04-b116-c5f9f843e760',
				btnHtmlId: '06d8a1ed-98b5-4b04-b116-c5f9f843e760',
			},
			{
				programId: '77543fb3-19c4-48c0-a7cb-3f15a60d10ed',
				btnHtmlId: '77543fb3-19c4-48c0-a7cb-3f15a60d10ed',
			},
			{
				programId: 'fe68f5b3-91f2-45ce-98b6-a134fa61651d',
				btnHtmlId: 'fe68f5b3-91f2-45ce-98b6-a134fa61651d',
			},
			{
				programId: '7c51f5d4-2c45-4fea-a368-e6caee273f4f',
				btnHtmlId: '7c51f5d4-2c45-4fea-a368-e6caee273f4f',
			},
		],
		sliders: [
			{
				htmlId: 'u_content_slider_1',
				variations: [
					1000004308, 1000004309, 1000004313, 1000004172, 1000004174, 1000004178, 1000004181,
					1000004185, 1000004167, 1000004169, 1000004171, 1000004157, 1000004160, 1000004161,
				],
				showMoreOption: true,
			},
		],
		products: [
			{
				htmlId: 'u_content_products_1',
				variations: [
					1000004308, 1000004309, 1000004313, 1000004172, 1000004174, 1000004178, 1000004181,
					1000004185, 1000004167, 1000004169, 1000004171, 1000004157, 1000004160, 1000004161,
				],
			},
		],
	};

	const getProductList = async (variationIds: string[]) => {
		try {
			const reps = await getListProductByVariationIdsApi(variationIds);
			setProductList(reps?.data);
		} catch (error) {}
	};

	const getHTML = async () => {
		try {
			const data: PromotionStaticResponse = await getPromotionStatic(tempId);
			setHtmlString(data.webStaticHtml?.map((item) => item?.value)?.join(''));
		} catch (error) {}
	};

	useEffect(() => {
		getProductList(tempSessions.sliders[0].variations as any);
	}, []);

	useIsomorphicLayoutEffect(() => {
		sliderRef.current = document.getElementById('slider-promotion-1');
		const headElement = document.querySelector('head');
		const styleElement = document.createElement('style');
		const convertStyle = style.replace('\n', '');

		styleElement.append(convertStyle);
		headElement?.append(styleElement);
		getHTML();
		return () => {
			headElement?.removeChild(styleElement);
		};
	}, []);

	useIsomorphicLayoutEffect(() => {
		sliderRef.current &&
			sliderRef.current?.scrollTo({
				left: scrollDetect,
				behavior: 'smooth',
			});
	}, [sliderRef, scrollDetect]);

	return (
		<React.Fragment>
			<Head title={title} />
			{deviceType === DeviceType.DESKTOP ? (
				<DefaultLayout>
					<div className='bg-[#e9d4bb] pb-10'>
						<div
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(data || htmlString),
							}}
						/>

						<div className='relative max-w-container  mx-auto '>
							{productList?.length > 0 ? (
								<div
									role='button'
									tabIndex={-1}
									onKeyPress={() => setScrollDetect(-1500)}
									onClick={() => setScrollDetect(-1500)}
									className='absolute cursor-pointer left-2 z-10 top-[calc(50%_-_12px)] flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'
								>
									<Icon name={IconEnum.CaretLeft} size={22} />
								</div>
							) : (
								<></>
							)}
							{productList?.length > 0 ? (
								<div
									role='button'
									tabIndex={-1}
									onKeyPress={() => setScrollDetect(1500)}
									onClick={() => setScrollDetect(1500)}
									className='absolute z-[20] cursor-pointer top-[calc(50%_-_12px)] right-2 flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'
								>
									<Icon name={IconEnum.CaretRight} size={22} />
								</div>
							) : (
								<></>
							)}
							<div id='slider-promotion-1' className='relative flex overflow-x-auto hide-scrollbar'>
								{[...productList, ...productList]?.map((item: ProductViewES, i: number) => {
									let value = getSelectorVariants({
										product: item,
									});

									return (
										<div key={i} className='h-full min-w-[260px] flex-[25%] px-2'>
											<ProductDetailCard
												image={item.variations}
												path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
												isRouter={item}
												price={value?.pricePromote || item.price}
												priceDash={value?.pricePromote && value?.moduleType !== 0 ? item.price : 0}
												isDealShock={value?.moduleType === TYPE_DISCOUNT.FLASH_SALE || false}
												description={{ brandName: item.brandName, title: item.title }}
												rating={{ rate: item.averageRating, total: item.averageStar }}
												isGuarantee={item.hasWarranty && true}
												shippingFee={Number(item.feeShip)}
												percentDiscount={value?.discountValue}
												isHeart={item.isLike ? true : false}
												classNameImage='h-full aspect-square'
												listOption={
													item?.variationConfigs?.configs?.every(
														(config) =>
															config.type === 2 &&
															config.propertyValues.some(
																(t) => t.propertyValueName && t.propertyValueId,
															),
													) && item.variations.length >= 2
														? item.variations
														: []
												}
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</DefaultLayout>
			) : (
				<DefaultLayoutMobile>
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(data || htmlString),
						}}
					></div>
				</DefaultLayoutMobile>
			)}
		</React.Fragment>
	);
};

export default PromotionPage;

// export const getStaticProps: GetStaticProps = async () => {
// 	return {
// 		props: {
// 			title: 'Khuyến mãi',
// 		},
// 	};
// };
// export const getStaticPaths: any = () => {
// 	return {
// 		paths: [{ params: { slug: 'banner-1-home-page' } }],
// 		fallback: false, // can also be true or 'blocking'
// 	};
// };
