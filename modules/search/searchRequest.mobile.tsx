import { ImageCustom, MiniCard } from 'components';
import { useAppSelector, useSearch } from 'hooks';
import { ProductViewES, QueryParams, SearchSuggestion } from 'models';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';

import Skeleton from '@/components/skeleton';
import { EmptyImage } from '@/constants/index';
import { selectedCatalogSector } from '@/store/reducers/appSlice';
interface ISearchRequestProps {
	textSearch?: string;
	onClick: (text: string, indexClick: number) => void;
}
interface SearchModel {
	keywords: SearchSuggestion[];
	brands: SearchSuggestion[];
	products: ProductViewES[];
}
const SearchRequestMobile: React.FC<ISearchRequestProps> = ({ textSearch, onClick }) => {
	const selectedCatalog = useAppSelector(selectedCatalogSector);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// if (selectedCatalog && selectedCatalog.length > 0) {
	// 	// const payload: QueryParams = {
	// 	// 	keyword: textSearch,
	// 	// 	categoryId: [selectedCatalog?.[selectedCatalog.length - 1].id],
	// 	// };
	// }
	let payload: QueryParams = {
		keyword: textSearch,
	};
	if (selectedCatalog && selectedCatalog.length > 0) {
		payload = { ...payload, categoryId: [selectedCatalog?.[selectedCatalog.length - 1].id] };
	}

	const { data, isValidating } = useSearch(payload);
	const listResult: SearchModel = data?.data ? data.data : {};
	const { keywords, brands, products } = listResult;

	const router = useRouter();
	useEffect(() => {
		if (textSearch) {
			setIsLoading(isValidating);
		} else {
			setIsLoading(true);
		}
	}, [isValidating, textSearch]);

	const renderLabel = (label: string) => {
		if (textSearch) {
			let index = label.toLowerCase().indexOf(textSearch.toLowerCase());
			if (index !== -1) {
				let length = textSearch.length;
				let prefix = label.substring(0, index);
				let suffix = label.substring(index + length);
				let match = label.substring(index, index + length);
				return (
					<span className='text-sm font-thin'>
						{prefix}
						<span className='font-sfpro_bold font-medium'>{match}</span>
						{suffix}
					</span>
				);
			} else {
				let lstText = textSearch.split(' ');
				lstText
					.filter((x) => x !== null && x !== '')
					?.forEach(
						(item, index) =>
							(label = label.replaceAll(
								new RegExp(item + '(?!([^<]+)?<)', 'gi'),
								`<span key='${index}' class='font-medium font-sfpro_bold'>$&</span>`,
							)),
					);
				return (
					<span className='text-sm font-thin' dangerouslySetInnerHTML={{ __html: label }}></span>
				);
			}
		}
		return (
			<>
				<span>{label}</span>
			</>
		);
	};

	const BrandsRequest = () => {
		return (
			<Fragment>
				{brands?.length > 0 &&
					brands.slice(0, 3).map((item, index) => (
						<div className='grid grid-cols-5 content-center items-center gap-2 py-1' key={index}>
							<div className='relative col-span-1 flex h-min w-min max-w-16 max-h-16 justify-center rounded-full border border-[#E0E0E0] bg-[#FFF5F8]'>
								<ImageCustom
									layout='fill'
									className='rounded-full'
									src={item.value ? item.value : EmptyImage}
								/>
							</div>
							<div className='col-span-4'>
								{item.brandName && (
									<div className='truncate break-all text-base font-medium text-333333'>
										{item.brandName}
									</div>
								)}
								{item.keywords && (
									<div className='flex items-center space-x-2 text-sm text-999999'>
										{item.keywords}
									</div>
								)}
							</div>
						</div>
					))}
			</Fragment>
		);
	};

	const ProductRequest = () => {
		return (
			<Fragment>
				{products?.length > 0 && (
					<div className='border-t-2 border-gray-100 py-4'>
						{products.slice(0, 4).map((item, index) => (
							<div
								key={index}
								role='button'
								tabIndex={index}
								onClick={() => router.push(`/${item.categoryUrlSlug}/${item.urlSlug}`)}
								onKeyPress={() => router.push(`/${item.categoryUrlSlug}/${item.urlSlug}`)}
							>
								<MiniCard
									title={item.title}
									image={
										item?.variations?.length && item?.variations[0]?.variationImage
											? item?.variations[0]?.variationImage
											: EmptyImage
									}
									price={
										item.promotions.length > 0 && item.promotions[0]?.pricePromote
											? item.promotions[0]?.pricePromote
											: item.variations.length > 0 && item.variations[0]?.price
											? item.variations[0].price
											: item.price
									}
									priceDash={
										item?.promotions?.length > 0 && item.promotions[0].pricePromote
											? item.promotions[0]?.price
											: undefined
									}
								/>
							</div>
						))}
					</div>
				)}
			</Fragment>
		);
	};

	const ManuallyRequest = () => {
		return (
			<div className='border-t-2 border-gray-100 py-2'>
				{keywords?.length > 0 &&
					keywords.map((item: any, index: number) => (
						<div
							key={index}
							className='flex cursor-pointer items-center py-2 text-sm hover:scale-105 hover:px-3'
							role='button'
							tabIndex={index}
							onMouseDown={() => onClick(item.keywords, index)}
						>
							<ImageCustom src='/static/svg/searchicon.svg' width={24} height={24} />
							<span className='flex justify-start px-2'>#{renderLabel(item.keywords)}</span>
						</div>
					))}
			</div>
		);
	};

	return (
		<>
			<div className='p-3'>
				{keywords?.length > 0 || products?.length > 0 || brands?.length > 0 ? (
					<Fragment>
						<BrandsRequest />
						<ManuallyRequest />
						<ProductRequest />
						{textSearch && (
							<div
								className='border-t-2 border-gray-100 py-4'
								role='button'
								tabIndex={0}
								onMouseDown={() => onClick(textSearch, 0)}
							>
								<span className='text-base text-[#126BFB]'>
									Xem thêm kết quả cho “{textSearch?.trim()}"
								</span>
							</div>
						)}
					</Fragment>
				) : isLoading ? (
					<Fragment>
						{[...new Array(9)].map((_, index) => {
							const width = 70 + (index % 2 === 0 && index < 5 ? -1 : 1) * index * 10;
							return (
								<div key={index} className='flex cursor-pointer items-center py-2 text-sm'>
									<Skeleton
										lines={1}
										type='text'
										height={'16px'}
										className={`w-[${width > 100 ? width % 100 : width}%]`}
									/>
								</div>
							);
						})}
						{textSearch && (
							<div
								className='border-t-2 border-gray-100 py-4'
								role='button'
								tabIndex={0}
								onMouseDown={() => onClick(textSearch, 0)}
							>
								<span className='text-base text-[#126BFB]'>
									Xem thêm kết quả cho “{textSearch?.trim()}"
								</span>
							</div>
						)}
					</Fragment>
				) : (
					<div className='border-t-2 border-gray-100 py-4'>
						<span className='text-base'>Không có kết quả nào cho "{textSearch?.trim()}"</span>
					</div>
				)}
			</div>
		</>
	);
};

export default SearchRequestMobile;
