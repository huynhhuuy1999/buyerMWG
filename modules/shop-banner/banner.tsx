import classNames from 'classnames';
import { ImageCustom, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { BannerSlides } from 'models';
import { useEffect, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';

const Banner = (props: any) => {
	const { data } = props;

	const Skeletons = (
		<div>
			{[...new Array(1)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						isBorder={false}
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						height={!props?.hasSubBanner ? 220 : 230}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const Skeletons_s = (
		<div>
			{[...new Array(1)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						isBorder={false}
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						height={112}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const settings = {
		// dots: false,
		infinite: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		slidesToScroll: 1,
		classDivNext: '-right-3 transform:none',
		classDivPrev: 'left-0 transform:none',
		nextArrow: () => (
			<div className='absolute right-3 top-[-130px] flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretRight} size={22} />
			</div>
		),
		prevArrow: () => (
			<div className='absolute left-0 top-[-130px] flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretLeft} size={22} />
			</div>
		),
		classNameDots: 'static -mt-[10px]',
		customPaging: (_: () => void, isActive: boolean) => (
			<div
				onClick={_}
				onKeyPress={_}
				role='button'
				tabIndex={0}
				style={{ width: data?.length > 8 ? 20 : 38 }}
				className={classNames(['h-1', isActive && 'bg-F05A94', !isActive && 'bg-white'])}
			></div>
		),
	};

	const [banners, setBanners] = useState<BannerSlides[]>([]);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) setBanners(data);
	}, [data]);

	return (
		<div className='pb-6'>
			<div className='container max-w-container'>
				<div className='grid grid-cols-3 gap-6px'>
					<div
						className={classNames(
							['-mb-7'],
							props?.hasSubBanner ? 'col-span-2' : 'col-span-3 max-h-[225px]',
						)}
					>
						{Array.isArray(data) ? (
							data?.length > 0 ? (
								<Slider {...settings}>
									{data?.length > 0 &&
										data
											?.sort((a: BannerSlides, b: BannerSlides) => {
												return a?.displayOrder - b?.displayOrder;
											})
											?.slice(0, 10)
											?.map((item: BannerSlides, index: number) => {
												return (
													<div
														key={index}
														className={classNames(
															['w-full relative h-[230px]'],
															props?.hasSubBanner ? 'max-h-[230px]' : 'max-h-[220px]',
														)}
													>
														<ImageCustom
															layout='fill'
															className='h-full w-full cursor-pointer object-fill opacity-90 hover:opacity-100'
															src={item?.imageUrl || EmptyImage}
															alt={item?.description || 'vuivui.com'}
														/>
													</div>
												);
											})}
								</Slider>
							) : (
								Skeletons
							)
						) : banners?.length > 0 ? (
							<Slider {...settings}>
								{banners?.length > 0 &&
									banners
										?.sort((a: BannerSlides, b: BannerSlides) => {
											return a?.displayOrder - b?.displayOrder;
										})
										?.slice(0, 10)
										?.map((item: BannerSlides, index: number) => {
											return (
												<div
													key={index}
													className={classNames(
														['w-full relative h-[230px]'],
														props?.hasSubBanner ? 'max-h-[230px]' : 'max-h-[220px]',
													)}
												>
													<ImageCustom
														layout='fill'
														className='h-full w-full cursor-pointer object-cover opacity-90 hover:opacity-100'
														src={item?.imageUrl || EmptyImage}
														alt={item?.description || 'vuivui.com'}
													/>
												</div>
											);
										})}
							</Slider>
						) : (
							Skeletons
						)}
					</div>
					{props?.hasSubBanner && (
						<div className='flex flex-col place-content-center gap-6px'>
							{Array.isArray(data) ? (
								data?.length > 0 ? (
									<div className='relative h-[112px] w-full'>
										<ImageCustom
											className='max-h-28 cursor-pointer opacity-90 hover:opacity-100'
											src={data[0]?.imageUrl || EmptyImage}
											alt={data[0]?.description || 'Vuivui.com'}
											layout='fill'
										/>
									</div>
								) : (
									Skeletons_s
								)
							) : banners?.length > 0 ? (
								<div className='relative h-[112px] w-full'>
									<ImageCustom
										className='max-h-28 cursor-pointer opacity-90 hover:opacity-100'
										src={data[0]?.imageUrl || EmptyImage}
										alt={data[0]?.description || 'Vuivui.com'}
										layout='fill'
									/>
								</div>
							) : (
								Skeletons_s
							)}

							{Array.isArray(data) ? (
								data?.length > 0 ? (
									<div className='relative h-[112px] w-full'>
										<ImageCustom
											className='max-h-28 cursor-pointer opacity-90 hover:opacity-100'
											src={data[1]?.imageUrl || EmptyImage}
											alt={data[1]?.description || 'Vuivui.com'}
											layout='fill'
										/>
									</div>
								) : (
									Skeletons_s
								)
							) : banners?.length > 0 ? (
								<div className='relative h-[112px] w-full'>
									<ImageCustom
										className='max-h-28 cursor-pointer opacity-90 hover:opacity-100'
										src={data[1]?.imageUrl || EmptyImage}
										alt={data[1]?.description || 'Vuivui.com'}
										layout='fill'
									/>
								</div>
							) : (
								Skeletons_s
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Banner;
