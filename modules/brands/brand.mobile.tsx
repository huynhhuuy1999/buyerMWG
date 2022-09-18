import { Icon, Skeleton } from 'components';
import { useBrand } from 'hooks';
import { IBrand } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';

import CircleCard from '@/components/Card/CircleCard';
interface BrandProps {
	data: Array<IBrand>;
	isNotFetchApiAll?: boolean;
	className?: string;
	isNotHeader?: boolean;
	isNotFooter?: boolean;
	loading?: boolean;
}
const BrandMobile = (props: BrandProps) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { data } = (props.isNotFetchApiAll ? props : useBrand(props.data)) || [];
	const { asPath } = useRouter();

	const Skeletons = (
		<div className='grid grid-cols-3 gap-2 pb-9 pt-6'>
			{[...new Array(6)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						isDescription
						key={index}
						center
						cardType={Skeleton.CardType.circle}
						type='card'
						width={108}
						height={108}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const [prod, setProd] = useState<any>([]);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) setProd(data);
	}, [data]);

	return (
		<div className='brand-mobile-bg py-4'>
			<div className='container'>
				<p className='mb-4 text-14 text-3E3E40'>Thương hiệu gợi ý</p>
				{Array.isArray(data) && data?.length ? (
					<div className='grid grid-cols-3 place-content-center justify-items-center gap-4'>
						{(data?.slice(0, 6) ? data?.slice(0, 6) : data).map((item: IBrand, index: number) => (
							<CircleCard
								key={index}
								description={item?.name}
								// discountPercent={parseInt(item.discountPercent || '0')}
								onClick={() => asPath === '/' && homeTracking(2)}
								image={item?.image}
								width='108px'
								height='108px'
								path={`search?brandIds=${item?.id}#${item?.type}`}
							/>
						))}
					</div>
				) : prod?.length > 0 ? (
					<div className='grid grid-cols-3 place-content-center justify-items-center gap-4'>
						{(data?.slice(0, 6) ? data?.slice(0, 6) : data).map((item: IBrand, index: number) => (
							<CircleCard
								key={index}
								description={item?.name}
								// discountPercent={parseInt(item.discountPercent || '0')}
								onClick={() => asPath === '/' && homeTracking(2)}
								image={item?.image}
								width='108px'
								height='108px'
								path={`search?brandIds=${item?.id}#${item?.type}`}
							/>
						))}
					</div>
				) : (
					Skeletons
				)}
			</div>
			{Array.isArray(data) && data?.length > 0 && (
				<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
					Xem thêm{' '}
					<Icon
						type='icon-chevron-right'
						size={10}
						variant='semi-secondary'
						className='-ml-1 mt-[-7px]'
					/>
				</p>
			)}
		</div>
	);
};

export default BrandMobile;
