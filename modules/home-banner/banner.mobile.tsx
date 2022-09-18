import classNames from 'classnames';
import { ImageCustom, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useBanner } from 'hooks';
import { BannerSlides } from 'models';
import { homeTracking } from 'services';
import { Slider } from 'vuivui-slider';

const BannerMobile = (props: any) => {
	const { data } = useBanner(props.data);

	const Skeletons = (
		<div className='mb-7 bg-[#f1f1f1]'>
			{[...new Array(1)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						isBorder={false}
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						height={120}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const settings = {
		dots: true,
		infinite: true,
		autoplaySpeed: 3000,
		autoplay: true,
		hiddenNext: true,
		hiddenPrev: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		classDivNext: '-right-3 top-[95px] transform:none',
		classDivPrev: 'left-0 top-[95px] transform:none',
		classNameDots: 'static -mt-[10px]',
		customPaging: (_: () => void, isActive: boolean) => (
			<div
				role='button'
				tabIndex={0}
				className={classNames([
					'min-w-[14px] h-1 bg-white',
					isActive && 'opacity-100',
					!isActive && 'opacity-30',
				])}
			/>
		),
	};

	return (
		<div className='bg-white'>
			<div className='max-w-container'>
				<div className='w-full'>
					{data?.length > 0 ? (
						<Slider {...settings}>
							{data
								?.sort((a: BannerSlides, b: BannerSlides) => {
									return a?.displayOrder - b?.displayOrder;
								})
								.map((item: BannerSlides, index: number) => {
									return (
										<div key={index} className='relative h-[120px] w-full '>
											<ImageCustom
												onClick={() => homeTracking(2)}
												className='cursor-pointer object-fill opacity-100 hover:opacity-95 w-full'
												src={item?.imageUrl || EmptyImage}
												alt={item?.description || 'vuivui.com'}
												width='100%'
											/>
										</div>
									);
								})}
						</Slider>
					) : (
						Skeletons
					)}
				</div>
			</div>
		</div>
	);
};

export default BannerMobile;
