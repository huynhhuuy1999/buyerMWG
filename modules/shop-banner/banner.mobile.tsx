import classNames from 'classnames';
import { ImageCustom, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { BannerTemplate } from 'models';
import { Slider } from 'vuivui-slider';

interface IBannerComponent {
	data: BannerTemplate[];
}

const BannerMobile = ({ data }: IBannerComponent) => {
	const Skeletons = (
		<div className='mb-7'>
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
		infinite: true,
		autoplaySpeed: 3000,
		hiddenNext: true,
		autoplay: true,
		hiddenPrev: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		classDivNext: '-right-3 top-[95px] transform:none',
		classDivPrev: 'left-0 top-[95px] transform:none',
		classNameDots: 'static -mt-[10px]',
		customPaging: (_: () => void, isActive: boolean) => (
			<div
				onClick={_}
				role='button'
				tabIndex={0}
				className={classNames([
					'min-w-[14px] h-1 bg-white',
					isActive && 'opacity-100',
					!isActive && 'opacity-30',
				])}
				onKeyPress={_}
			></div>
		),
	};

	return (
		<div className='bg-white'>
			<div className='max-w-container'>
				<div className='w-full'>
					{data?.length > 0 ? (
						<Slider {...settings}>
							{data
								?.sort((a: BannerTemplate, b: BannerTemplate) => {
									return a?.displayOrder - b?.displayOrder;
								})
								.map((item: BannerTemplate, index: number) => {
									return (
										<div key={index} className='relative h-[120px] w-full '>
											<ImageCustom
												className='cursor-pointer object-cover opacity-90 hover:opacity-100'
												src={item?.imageUrl || EmptyImage}
												alt={item?.description || 'vuivui.com'}
												layout='fill'
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
