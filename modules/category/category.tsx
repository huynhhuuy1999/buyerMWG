import { CategoryProductCard, Skeleton } from 'components';
import { useCategoryHome } from 'hooks';
import { Category } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';

const hooksCategoryHome: any = useCategoryHome;
const Category = (props: any) => {
	const { query, asPath } = useRouter();

	const [cate, setCate] = useState<Category[]>([]);

	const { data } =
		(props?.isNotFetchApiHome
			? props
			: query?.bot_crawler
			? props.data
			: hooksCategoryHome(props.data)) || [];

	const Skeletons = (
		<div className='grid min-w-container grid-cols-14 gap-4 bg-white pt-4 pb-10'>
			{[...new Array(14)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						key={index}
						cardType={Skeleton.CardType.circle}
						type='card'
						width={64}
						height={64}
						isDescription
						lines={1}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	useEffect(() => {
		if (Array.isArray(data)) setCate(data);
	}, [data]);

	return (
		<div className='bg-white'>
			<div className='container'>
				{Array.isArray(data?.data) && data?.data?.length ? (
					<div className='hide-scrollbar flex flex-nowrap gap-4 overflow-auto bg-white pt-4 pb-6'>
						{data?.data?.slice(0, 14)?.map((item: Category, index: number) => (
							<CategoryProductCard
								onClick={() => asPath === '/' && homeTracking(1)}
								key={index}
								description={item?.name}
								image={item.image}
								type={'CATEGORY_PRODUCT_HOMEPAGE'}
								path={`/${item.urlSlug}`}
							/>
						))}
					</div>
				) : cate?.length ? (
					<div className='hide-scrollbar flex flex-nowrap gap-4 overflow-auto bg-white pt-4 pb-6'>
						{cate?.slice(0, 14)?.map((item: Category, index: number) => (
							<CategoryProductCard
								onClick={() => asPath === '/' && homeTracking(1)}
								key={index}
								description={item?.name}
								image={item.image}
								type={'CATEGORY_PRODUCT_HOMEPAGE'}
								path={`/${item.urlSlug}`}
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

export default Category;
