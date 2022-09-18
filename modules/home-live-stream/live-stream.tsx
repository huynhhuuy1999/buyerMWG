import { Product } from 'models';
import Link from 'next/link';

import ProductCard from '@/components/Card/ProductCard';
import Skeleton, { CardType } from '@/components/skeleton';
// import { useState } from 'react';

const LiveStream = (props: any) => {
	const { data } = props;

	const Skeletons = (
		<div className='grid grid-cols-5 gap-4 bg-white pb-9 pt-6'>
			{[...new Array(5)].map((_, index) => {
				return (
					<Skeleton
						key={index}
						cardType={CardType.square}
						type='card'
						width={208}
						height={252}
					></Skeleton>
				);
			})}
		</div>
	);

	return (
		<div className='mt-4 bg-white pt-8'>
			<div className='container mb-3'>
				<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
					<h2 className='font-sfpro_bold text-20 font-bold text-3E3E40 '>LIVESTREAM</h2>
					{data?.length && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				{data?.length ? (
					<div className='flex gap-4 overflow-auto pt-6'>
						{data?.slice(0, 6).map((item: Product, index: number) => (
							<ProductCard
								key={index}
								description={item.description}
								price={item.price}
								image={item?.variations[0]?.variationImage}
								width='208px'
								height='252px'
							/>
						))}
					</div>
				) : (
					Skeletons
				)}
			</div>
		</div>
	);
};

export default LiveStream;
