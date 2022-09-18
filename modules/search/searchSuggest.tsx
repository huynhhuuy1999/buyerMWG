import { CategoryProductCard, Tag } from 'components';
import { useAppSelector } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';
import { homeTracking } from 'services';

import { catalogSearchSuggestionSelector } from '@/store/reducers/categorySlide';
export interface ISearchSuggestProps {
	recentList: string[];
	listTrending: string[];
	onClick: (text: string) => void;
	onRemove: (text: string) => void;
}
const SearchSuggest: React.FC<ISearchSuggestProps> = ({
	recentList,
	listTrending,
	onClick,
	onRemove,
}) => {
	const catalogSuggestion = useAppSelector(catalogSearchSuggestionSelector);
	const { asPath } = useRouter();
	const RecentSearch: React.FC = () => {
		return (
			<>
				{recentList?.length > 0 && (
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
				{listTrending?.length > 0 && (
					<div className='py-2'>
						<div className='py-2'>
							<span className='text-sm font-medium leading-tight tracking-wide text-999999'>
								Các mục tìm kiếm phổ biến
							</span>
						</div>
						<div className='flex flex-row flex-wrap space-x-2'>
							{listTrending.map((item: string, index: number) => (
								<Tag title={`#${item}`} gap={1} onMouseDown={() => onClick(item)} key={index} />
							))}
						</div>
					</div>
				)}
			</>
		);
	};

	return (
		<div className='container'>
			<RecentSearch />
			<PopularSearch />
			{(catalogSuggestion || []).length > 0 && (
				<div className='py-2'>
					<div className='py-2'>
						<span className='text-sm font-medium leading-tight tracking-wide'>
							Xem theo danh mục
						</span>
					</div>
					<div>
						<div className='flex w-full flex-wrap content-center justify-start'>
							{catalogSuggestion.map((item: any, index: number) => (
								<CategoryProductCard
									description={item.name}
									onClick={() => asPath === '/' && homeTracking(1)}
									key={index}
									className='mx-1 cursor-pointer py-1'
									image={item.image}
									path={`/${item.urlSlug}`}
									type={'CATEGORY_PRODUCT_NORMAL'}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchSuggest;
