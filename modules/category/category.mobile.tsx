import { CategoryProductCard, Skeleton } from 'components';
import { useAppDispatch, useCategoryHome } from 'hooks';
import { Category } from 'models';
import { ShowCatalog } from 'models/';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { appActions } from 'store/reducers/appSlice';
import { Icon, IconEnum } from 'vuivui-icons';
// const DEFAULT_TOTAL_CATEGORY = 12;
const hooksCategoryHome: any = useCategoryHome;

const CategoryMobile = (props: any) => {
	const dispatch = useAppDispatch();
	const { query } = useRouter();
	const { data } =
		(props?.isNotFetchApiHome
			? props
			: query?.bot_crawler
			? props
			: hooksCategoryHome(props.data)) || [];
	const { asPath } = useRouter();
	const layoutType = useMemo(() => (props?.isNotFetchApiHome ? 3 : 5), [props.isNotFetchApiHome]);

	const [cate, setCate] = useState<Category[]>(data);

	// const list: ICategoryTag[] = [
	// 	{
	// 		color: '#EFEDFC',
	// 		content: 'Deal sốc',
	// 		badgeCount: 34,
	// 		path: '',
	// 	},
	// 	{
	// 		color: '#FEEFEF',
	// 		content: 'Bảng tin',
	// 		badgeCount: 0,
	// 		path: '',
	// 	},
	// 	{
	// 		color: '#FFF1DC',
	// 		content: 'Livestream',
	// 		badgeCount: 0,
	// 		path: '',
	// 	},
	// 	{
	// 		color: '#FBF0FD',
	// 		content: 'Cá nhân',
	// 		badgeCount: 20,
	// 		path: '',
	// 	},
	// ];

	useEffect(() => {
		if (Array.isArray(data)) setCate(data);
	}, [data]);

	const Skeletons = useMemo(
		() => (
			<div className={` grid  grid-cols-${layoutType} container gap-7px bg-white pt-4`}>
				{[...new Array(10)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							center
							cardType={Skeleton.CardType.circle}
							type='card'
							width={61}
							height={61}
							lines={1}
							isDescription
						></Skeleton.Skeleton>
					);
				})}
			</div>
		),
		[],
	);

	let timeout: any = null;

	const onOpen = () => {
		clearTimeout(timeout);
		document.body.style.overflow = 'hidden';
		dispatch(appActions.setIsShowCatalog(ShowCatalog.fromLeft));
	};

	return (
		<div className='mt-[-28px] bg-white pt-2'>
			{Array.isArray(data?.data) ? (
				data?.data?.length > 0 ? (
					<div
						className={`grid grid-cols-${layoutType} container justify-items-center gap-7px ${
							props.isNotFetchApiHome ? 'pt-[32px]' : 'pt-4'
						}`}
					>
						{data?.data?.slice(0, 9)?.map((item: Category, index: number) => (
							<CategoryProductCard
								path={`/${item.urlSlug}`}
								onClick={() => asPath === '/' && homeTracking(1)}
								key={index}
								description={item?.name}
								image={item?.image}
								type={'CATEGORY_PRODUCT_HOMEPAGE_SMALL'}
							/>
						))}

						{data?.data?.length > 9 ? (
							<div
								className='w-61px rounded-md'
								onClick={() => onOpen()}
								onKeyDown={() => onOpen()}
								role={'button'}
								tabIndex={0}
							>
								<div className='flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#fff5f8]'>
									<div className='h-6 w-6 rounded-full bg-[#F05A94]'>
										<Icon name={IconEnum.CaretRight} size={16} color='#fff' className='mt-1 ml-1' />
									</div>
								</div>

								<p className='mt-1 text-center text-12 text-[#666666] line-clamp-2 md:text-14'>
									Tất cả danh mục
								</p>
							</div>
						) : (
							<></>
						)}
					</div>
				) : (
					Skeletons
				)
			) : cate?.length > 0 ? (
				<div
					className={`grid grid-cols-${layoutType}  container justify-items-center gap-7px ${
						props.isNotFetchApiHome ? 'pt-[32px]' : 'pt-4'
					}`}
				>
					{cate?.slice(0, 9)?.map((item: Category, index: number) => (
						<CategoryProductCard
							path={`/${item.urlSlug}`}
							onClick={() => asPath === '/' && homeTracking(1)}
							key={index}
							description={item?.name}
							image={item?.image}
							type={'CATEGORY_PRODUCT_HOMEPAGE_SMALL'}
						/>
					))}

					{cate?.length > 9 ? (
						<div
							className='w-61px rounded-md'
							onClick={() => onOpen()}
							onKeyDown={() => onOpen()}
							role={'button'}
							tabIndex={0}
						>
							<div className='flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#fff5f8]'>
								<div className='h-6 w-6 rounded-full bg-[#F05A94]'>
									<Icon name={IconEnum.CaretRight} size={16} color='#fff' className='mt-1 ml-1' />
								</div>
							</div>

							<p className='mt-1 text-center text-12 text-[#666666] line-clamp-2 md:text-14'>
								Tất cả danh mục
							</p>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				Skeletons
			)}
		</div>
	);
};

export default CategoryMobile;
