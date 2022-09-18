import { ImageCustom } from 'components';
import { IBrand } from 'models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';

import CircleCard from '@/components/Card/CircleCard';
import Skeleton, { CardType } from '@/components/skeleton';
import { useBrand } from '@/hooks/useBrand';

const BRAND_SUGGESTION = '/thuong-hieu-goi-y';
const DEFAULT_TOTAL_BRANDS = 6;
interface BrandProps {
	data: Array<IBrand>;
	isNotFetchApiAll?: boolean;
	className?: string;
	isNotHeader?: boolean;
	isNotFooter?: boolean;
	loading?: boolean;
}
const Brand = (props: BrandProps) => {
	const isNotHeader = useMemo(() => props.isNotHeader, [props.isNotHeader]);
	const isNotFooter = useMemo(() => props.isNotFooter, [props.isNotFooter]);
	const { asPath } = useRouter();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { data } = (props.isNotFetchApiAll ? props : useBrand(props.data)) || [];

	const Skeletons = React.memo(() => (
		<div className='hide-scrollbar container flex flex-nowrap gap-15px overflow-auto pt-6'>
			{[...new Array(DEFAULT_TOTAL_BRANDS)].map((_, index) => {
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
	));

	const [prod, setProd] = useState<any>([]);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) setProd(data);
	}, [data]);

	return (
		<>
			{props.loading
				? Skeletons
				: data?.length > 0 && (
						<div className={'bg-white mt-4 pt-8 pb-8 ' + props.className}>
							<div className='container'>
								{!isNotHeader && (
									<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
										<p className='font-sfpro_semiBold text-20 text-3E3E40 '>Thương hiệu gợi ý</p>
										{data?.length > 0 && (
											<Link href={BRAND_SUGGESTION}>
												<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
													Xem tất cả {`>`}
												</p>
											</Link>
										)}
									</div>
								)}
								<div className='hide-scrollbar container flex flex-nowrap gap-15px overflow-auto pt-6'>
									{Array.isArray(data)
										? data
												.slice(0, 6)
												?.map((item: IBrand, index: number) => (
													<CircleCard
														onClick={() => asPath === '/' && homeTracking(2)}
														key={index}
														description={item?.name}
														discountPercent={parseInt('25' || '0')}
														image={item?.image}
														classImage='border-4 border-F2F2F2'
														path={'/suggest-brand/' + item.urlSlug}
														width={171}
														height={171}
													/>
												))
										: prod?.length > 0
										? prod
												.slice(0, 6)
												?.map((item: IBrand, index: number) => (
													<CircleCard
														key={index}
														onClick={() => asPath === '/' && homeTracking(2)}
														description={item?.name}
														discountPercent={parseInt('25' || '0')}
														image={item?.image}
														classImage='border-4 border-F2F2F2'
														path={'/suggest-brand/' + item.urlSlug}
														width={171}
														height={171}
													/>
												))
										: Skeletons}
								</div>
								{!isNotFooter && data?.length > 1 && (
									<div className='text-center font-normal text-primary-0088F9'>
										<Link href='/'>Xem thêm</Link>
										<span className='pl-1'>
											<ImageCustom
												src='/static/svg/chevron_right_blue.svg'
												width={10}
												height={10}
											/>
										</span>
									</div>
								)}
							</div>
						</div>
				  )}
		</>
	);
};

export default Brand;
