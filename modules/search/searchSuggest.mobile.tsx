import { CategoryProductCard, Tag } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks';
import { ShowCatalog } from 'models';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { homeTracking } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

import { appActions } from '@/store/reducers/appSlice';
import { catalogSearchSuggestionSelector } from '@/store/reducers/categorySlide';
interface ISearchSuggestProps {
	recentList: string[];
	listTrending: string[];
	onClick: (text: string) => void;
	onRemove: (text: string) => void;
}
const SearchSuggestMobile: React.FC<ISearchSuggestProps> = ({
	recentList,
	listTrending,
	onClick,
	onRemove,
}) => {
	const categoryList = useAppSelector(catalogSearchSuggestionSelector);
	let timeout: any = null;
	const dispatch = useAppDispatch();
	const onOpen = () => {
		clearTimeout(timeout);
		document.body.style.overflow = 'hidden';
		dispatch(appActions.setIsShowCatalog(ShowCatalog.normal));
	};

	const { asPath } = useRouter();

	const RecentSearch: React.FC = () => {
		return (
			<>
				{(recentList || []).length > 0 && (
					<div className='py-2'>
						<div className='py-2'>
							<span className='text-sm font-medium leading-tight tracking-wide text-999999'>
								Các tìm kiếm gần đây
							</span>
						</div>
						<div className='flex flex-row flex-wrap space-x-2'>
							{recentList.map((item, index) => (
								<Tag
									title={item}
									gap={1}
									onRemove={() => onRemove(item)}
									key={index}
									onMouseDown={() => onClick(item)}
								/>
							))}
						</div>
					</div>
				)}
			</>
		);
	};
	const PopularSearch: React.FC = () => {
		return (
			<>
				{(listTrending || []).length > 0 && (
					<div className='py-2'>
						<div className='py-2'>
							<span className='text-sm font-medium leading-tight tracking-wide text-999999'>
								Các mục tìm kiếm phổ biến
							</span>
						</div>
						<div className='flex flex-wrap gap-x-2'>
							{listTrending.map((item, index) => (
								<Tag title={`#${item}`} gap={1} onMouseDown={() => onClick(item)} key={index} />
							))}
						</div>
					</div>
				)}
			</>
		);
	};
	return (
		<div className=''>
			<RecentSearch />
			<PopularSearch />
			{(categoryList || []).length > 0 && (
				<div className='py-2'>
					<div className='py-2'>
						<span className='text-sm font-medium leading-tight tracking-wide text-999999'>
							Xem theo danh mục
						</span>
					</div>
					<Fragment>
						<div className='grid grid-cols-5 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8'>
							{categoryList.slice(0, 9).map((item: any, index: number) => (
								<CategoryProductCard
									// path={`/${item.urlSlug}`}
									onClick={() => {
										onClick(item.name);
										if (asPath === '/') {
											homeTracking(1);
										}
									}}
									key={index}
									width={'auto'}
									description={item?.name}
									image={item?.image}
									className='mr-2 mt-2 w-auto'
									type={'CATEGORY_PRODUCT_HOMEPAGE'}
								/>
							))}
							{categoryList?.length > 9 ? (
								<a
									className='relative flex h-full cursor-pointer flex-col items-center bg-white p-0 mr-2 mt-2 w-auto'
									onClick={() => onOpen()}
									onKeyDown={() => onOpen()}
									role={'button'}
									tabIndex={0}
								>
									<div className='flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#fff5f8]'>
										<div className='h-6 w-6 rounded-full bg-[#F05A94]'>
											<Icon
												name={IconEnum.CaretRight}
												size={16}
												color='#fff'
												className='mt-1 ml-1'
											/>
										</div>
									</div>

									<p className='mt-1 text-center text-12 text-[#666666] line-clamp-2 md:text-14'>
										Tất cả danh mục
									</p>
								</a>
							) : (
								<></>
							)}
						</div>
					</Fragment>
				</div>
			)}
		</div>
	);
};

export default React.memo(SearchSuggestMobile);
