import { homeTracking } from 'services';

import CircleCard from '@/components/Card/CircleCard';
import Skeleton, { CardType } from '@/components/skeleton';
import { useCategoryService } from '@/hooks/useCategoryService';
import { ServiceCategory } from '@/models/category';
// import { useState, useEffect } from 'react';

const ServiceMobile = (props: any) => {
	const { data } = useCategoryService(props.data);

	const Skeletons = (
		<div className='grid grid-cols-3 gap-2 bg-white pb-9 pt-6'>
			{[...new Array(6)].map((_, index) => {
				return (
					<Skeleton
						isDescription
						key={index}
						center
						cardType={CardType.circle}
						type='card'
						width={102}
						height={102}
					></Skeleton>
				);
			})}
		</div>
	);

	return (
		<div className='bg-white py-4'>
			<div className='container'>
				<h2 className='mb-4 text-14 text-3E3E40'>Dịch vụ</h2>
				<div className='max-w-desktop m-auto flex flex-col text-center'>
					{Array.isArray(data) && data?.length > 0 ? (
						<div className='grid grid-cols-3 place-content-center justify-items-center gap-4'>
							{data?.slice(0, 6)?.map((item: ServiceCategory, index: number) => (
								<CircleCard
									key={index}
									description={item?.name}
									// discountPercent={parseInt(item.discountPercent || '0')}
									image={item?.image}
									onClick={() => homeTracking(9)}
									width='108px'
									height='108px'
								/>
							))}
						</div>
					) : (
						Skeletons
					)}
				</div>
			</div>
			{Array.isArray(data) && data?.length > 0 && (
				<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
					Xem thêm{' '}
					<img className='ml-6px mt-2px' src='/static/svg/chevron-right-009ADA.svg' alt='' />
				</p>
			)}
		</div>
	);
};

export default ServiceMobile;
