import classNames from 'classnames';
import { ImageCustom, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useBanner } from 'hooks';
import { BannerSlides, BannerType } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';

const Banner = (props: any) => {
	const { data, isLoading } = useBanner(props.data);
	const [isFullBanner, setIsFullBanner] = useState(true);
	const { push } = useRouter();

	const Skeletons = (
		<div className='pb-6 bg-[#f1f1f1]'>
			{[...new Array(1)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						isBorder={false}
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						height={207}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const Skeletons_s = (
		<div className='bg-[#f1f1f1]'>
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
		dots: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		classDivNext: '-right-3 transform:none',
		classDivPrev: 'left-0 transform:none',
		classNameDots: 'static -mt-[10px]',
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
		customPaging: (_: () => void, isActive: boolean) => (
			<div
				onClick={_}
				onKeyDown={_}
				role='button'
				tabIndex={0}
				style={{ width: data?.length > 8 ? 20 : 38 }}
				className={classNames(['h-1', isActive && 'bg-F05A94', !isActive && 'bg-white'])}
			></div>
		),
	};
	const [banners, setBanners] = useState<BannerSlides[]>([]);

	useEffect(() => {
		if (!isLoading) {
			if (
				banners &&
				banners.find((item: BannerSlides) => item.type === BannerType.HOME_BANNER_TOP_RIGHT) &&
				banners.find((item: BannerSlides) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
			) {
				setIsFullBanner(true);
			} else setIsFullBanner(false);
		}
	}, [banners, isLoading]);

	useEffect(() => {
		if (!isLoading) {
			if (Array.isArray(data) && data?.length) {
				setBanners(data);
				if (
					data &&
					data.find((item: BannerSlides) => item.type === BannerType.HOME_BANNER_TOP_RIGHT) &&
					data.find((item: BannerSlides) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
				) {
					setIsFullBanner(true);
				} else setIsFullBanner(false);
			}
		}
	}, [data, isLoading]);

	return (
		<div className='pb-6'>
			<div className={classNames('container max-w-container', !isFullBanner && 'pb-6')}>
				<div className='grid grid-cols-3 gap-6px'>
					<div
						className={classNames(
							['-mb-7'],
							isFullBanner ? 'col-span-2 h-[230px] ' : 'col-span-3 h-[230px]',
						)}
					>
						{!Array.isArray(data) ? (
							data?.length > 0 ? (
								<Slider {...settings}>
									{data?.length > 0
										? data
												?.filter(
													(a: BannerSlides) =>
														a.type !== BannerType.HOME_BANNER_BOTTOM_RIGHT &&
														a.type !== BannerType.HOME_BANNER_TOP_RIGHT,
												)
												?.sort((a: BannerSlides, b: BannerSlides) => {
													return a?.displayOrder - b?.displayOrder;
												})
												?.slice(0, 10)
												?.map((item: BannerSlides, index: number) => {
													return (
														<div
															key={index}
															className={classNames(
																['relative h-[230px]'],
																'max-h-[230px]',
																'fix-div-center',
															)}
															onClick={() => {
																homeTracking(2);
																push(`/promotion/${item?.description.replace(/ /g, '-')}`);
															}}
															aria-hidden='true'
														>
															<img
																height={230}
																className='h-full min-w-[735px] min-h-[230px] cursor-pointer object-fill opacity-100 hover:opacity-95'
																src={item?.imageUrl || EmptyImage}
																alt={item?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE}
															/>
														</div>
													);
												})
										: Skeletons}
								</Slider>
							) : (
								Skeletons
							)
						) : banners?.length > 0 ? (
							<Slider {...settings}>
								{banners?.length > 0 &&
									banners
										?.filter(
											(a: BannerSlides) =>
												a.type !== BannerType.HOME_BANNER_BOTTOM_RIGHT &&
												a.type !== BannerType.HOME_BANNER_TOP_RIGHT,
										)
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
														isFullBanner ? 'max-h-[230px]' : 'max-h-[220px]',
													)}
													onClick={() => {
														homeTracking(2);
														push(`/promotion/${item?.description.replace(/ /g, '-')}`);
													}}
													aria-hidden='true'
												>
													<img
														height={230}
														className='h-full min-w-[735px] min-h-[230px] cursor-pointer object-fill opacity-100 hover:opacity-95'
														src={item?.imageUrl || EmptyImage}
														alt={item?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE}
													/>
												</div>
											);
										})}
							</Slider>
						) : (
							Skeletons
						)}
					</div>
					{isFullBanner && (
						<div className='flex flex-col place-content-center gap-6px'>
							{Array.isArray(data) &&
							data?.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT) ? (
								data?.length > 0 ? (
									<div className='relative h-[112px] w-full'>
										<ImageCustom
											quality={100}
											onClick={() => homeTracking(2)}
											className='h-full cursor-pointer opacity-100 hover:opacity-95'
											src={
												data.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT)
													?.imageUrl || EmptyImage
											}
											alt={
												data.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT)
													?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE
											}
										/>
									</div>
								) : (
									Skeletons_s
								)
							) : banners?.length > 0 &&
							  banners?.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT) ? (
								<div className='relative h-[112px] w-full'>
									<ImageCustom
										quality={100}
										onClick={() => homeTracking(2)}
										className='h-full cursor-pointer opacity-100 hover:opacity-95'
										src={
											banners.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT)
												?.imageUrl || EmptyImage
										}
										alt={
											banners.find((item) => item.type === BannerType.HOME_BANNER_TOP_RIGHT)
												?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE
										}
									/>
								</div>
							) : (
								Skeletons_s
							)}

							{Array.isArray(data) &&
							data?.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT) ? (
								data?.length > 0 ? (
									<div className='relative h-[112px] w-full'>
										<ImageCustom
											quality={100}
											onClick={() => homeTracking(2)}
											className='h-full cursor-pointer opacity-100 hover:opacity-95'
											src={
												data.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
													?.imageUrl || EmptyImage
											}
											alt={
												data.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
													?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE
											}
										/>
									</div>
								) : (
									Skeletons_s
								)
							) : banners?.length > 0 &&
							  banners?.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT) ? (
								<div className='relative h-[112px] w-full'>
									<ImageCustom
										quality={100}
										onClick={() => homeTracking(2)}
										className='h-full cursor-pointer opacity-100 hover:opacity-95'
										src={
											banners.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
												?.imageUrl || EmptyImage
										}
										alt={
											banners.find((item) => item.type === BannerType.HOME_BANNER_BOTTOM_RIGHT)
												?.description || process.env.NEXT_PUBLIC_DOMAIN_TITLE
										}
										priority
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
