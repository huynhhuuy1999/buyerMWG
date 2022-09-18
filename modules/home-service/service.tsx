import Link from 'next/link';
import { homeTracking } from 'services';

import CircleCard from '@/components/Card/CircleCard';
import Skeleton, { CardType } from '@/components/skeleton';
import { useCategoryService } from '@/hooks/useCategoryService';
import { ServiceCategory } from '@/models/category';
// import { useEffect, useState } from 'react';

const Service = (props: any) => {
	const { data } = useCategoryService(props.data);

	const Skeletons = (
		<div className='grid grid-cols-6 gap-4 bg-white pb-9 pt-6'>
			{[...new Array(6)].map((_, index) => {
				return (
					<Skeleton
						isDescription
						key={index}
						cardType={CardType.circle}
						type='card'
						width={171}
						height={171}
					></Skeleton>
				);
			})}
		</div>
	);

	return (
		<div className='mt-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
					<h2 className='font-sfpro_semiBold text-20 text-3E3E40 '>DỊCH VỤ</h2>
					{Array.isArray(data) && data?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				<div className='max-w-desktop hide-scrollbar m-auto flex flex-col text-center'>
					{Array.isArray(data) && data?.length ? (
						<div className='container flex flex-nowrap gap-15px overflow-auto pt-6'>
							{data?.slice(0, 6).map((item: ServiceCategory, index: number) => (
								<CircleCard
									key={index}
									description={item?.name}
									onClick={() => homeTracking(9)}
									image={item?.image}
									classImage='border-4 border-E7E7E8 hover:border-gray-300'
									// path={`brandIds=${encodeURIComponent(item?.id + '#' + item?.type)}`}
									width='171px'
									height='171px'
								/>
							))}
						</div>
					) : (
						Skeletons
					)}
				</div>
			</div>
		</div>
	);
};

export default Service;
