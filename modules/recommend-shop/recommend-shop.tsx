import { Skeleton } from 'components';
import { IMerchantSearch } from 'models';
import React, { FC } from 'react';
import { Slider } from 'vuivui-slider';

import ShopCard from '@/components/Card/ShopComponent/shop-card';
import { CardType } from '@/components/skeleton';

interface IRecommendShop {
	keyword?: string;
	listMerchant?: Array<IMerchantSearch>;
	error?: any;
	// loading?: boolean;
}

const RecommendShop: FC<IRecommendShop> = ({ keyword, listMerchant, error }) => {
	const Skeletons = () => (
		<div className='flex'>
			{[...new Array(3)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						key={index}
						cardType={CardType.square}
						type='card'
						width={314}
						height={126}
					/>
				);
			})}
		</div>
	);

	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		arrows: true,
		// nextArrow: () => (
		// 	<div className='absolute right-3 float-right top-0 flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
		// 		<Icon type='icon-chevron-right' size={22} variant='dark' />
		// 	</div>
		// ),
		// autoplay: false,
		// prevArrow: () => (
		// 	<div className='absolute left-3 top-0 flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
		// 		<Icon type='icon-chevron-left' size={22} variant='dark' />
		// 	</div>
		// ),
		classDivNext: '-right-3 top-[70px] transform:none',
		classDivPrev: 'left-0 top-[70px] transform:none',
		disabledPrev: true,
		// hiddenPrev: true,
		disabledNext: true,
		classSlide: 'mr-[1px]',
	};

	return (
		<>
			<div className='container mx-auto !mt-2'>
				<div className='flex justify-between'>
					<p className='flex font-sfpro_bold text-20 uppercase'>
						<span className='font-bold text-3E3E40'>SHOP LIÊN QUAN ĐẾN</span>
						{keyword !== '' ? <span className='ml-6px text-F05A94'>{`"${keyword}"`}</span> : ''}
					</p>
					{listMerchant?.length && listMerchant?.length > 3 ? (
						<span className='cursor-pointer text-16 font-medium'>{`Xem tất cả >`}</span>
					) : null}
				</div>
			</div>
			{!listMerchant && !error ? (
				<div className='container mx-auto pt-5'>
					<Skeletons />
				</div>
			) : listMerchant?.length ? (
				<div className='container mx-auto'>
					<div className='h-[150px]'>
						{listMerchant.length ? (
							<Slider {...settings}>
								{listMerchant?.map((item, index) => {
									return <ShopCard key={index} data={item} className={'mr-3'} />;
								})}
							</Slider>
						) : null}
					</div>
				</div>
			) : null}
		</>
	);
};

export default RecommendShop;
