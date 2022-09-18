import { CheckCard } from 'components';
import { TYPE_FILTER_PARAM } from 'enums';
import { Property } from 'models';
import { useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

export interface IFilterBoxMobile {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: any;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	title?: string;
}

const FilterBoxMobile: React.FC<IFilterBoxMobile> = ({
	className,
	onClickOutside,
	listData,
	onSelect,
	defaultSelected,
	title,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);
	const [isMore, setIsMore] = useState<boolean>(true);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside && onClickOutside(event);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref, onClickOutside]);

	useEffect(() => {
		if (defaultSelected) setListSelected(defaultSelected);
	}, [defaultSelected]);

	return (
		<div className={`bg-white border-b border-b-[#f6f6f6] py-6 ${className || ''}`} ref={ref}>
			<div className='flex flex-col'>
				<span className='mb-6 text-16 text-333333'>{title}</span>
				<div className='mr-[-8px] flex flex-wrap'>
					{listData && listData.length
						? (isMore ? [...listData].slice(0, 12) : listData).map(
								(item: Property, index: number) => {
									const pos = listSelected.some((category) => item.id === category.id);
									return (
										<CheckCard
											key={index}
											onClick={() =>
												onSelect &&
												onSelect({
													id: item.id,
													label: item.name,
												})
											}
											checked={pos}
											className={`mb-2 !mr-[8px] !h-auto min-h-[2.5rem] w-[calc(calc(100%_/_3)_-_8px)]`}
										>
											<div className='flex min-h-[2.5rem] w-full items-center justify-center rounded-3px px-1'>
												<span className='text-ellipsis text-13 line-clamp-1'>{item.name}</span>
											</div>
										</CheckCard>
									);
								},
						  )
						: listData?.propertyValues?.length
						? (isMore
								? [...listData?.propertyValues].slice(0, 12) || []
								: [...listData?.propertyValues] || []
						  )?.map((item: Property, index) => {
								const pos = listSelected.some((itemSelected) =>
									item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
										? itemSelected.id === `prop_${listData.id}:[${item.id}#${item.rangeValueType}]`
										: itemSelected.id ===
										  `prop_${listData.id}:[${item.rangeValueId}#${item.rangeValueType}]`,
								);
								return (
									<CheckCard
										key={index}
										onClick={() =>
											onSelect &&
											onSelect({
												id:
													item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
														? `prop_${listData.id}:[${item.id}#${item.rangeValueType}]`
														: `prop_${listData.id}:[${item.rangeValueId}#${item.rangeValueType}]`,
												label:
													item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
														? item.name
														: item.rangeValueName,
											})
										}
										checked={pos}
										className={`mb-2 !mr-[8px] !h-auto min-h-[2.5rem] w-[calc(calc(100%_/_3)_-_8px)]`}
									>
										<div className='flex min-h-[2.5rem] w-full items-center justify-center rounded-3px px-1'>
											<span className='text-ellipsis text-13 line-clamp-1'>{item.name}</span>
										</div>
									</CheckCard>
								);
						  })
						: null}
				</div>
				{(listData?.length > 12 || listData?.propertyValues?.length > 12) && isMore ? (
					<span
						className='text-center text-[#0093E9] '
						role={'button'}
						onKeyPress={(e) => {
							e.stopPropagation();
							setIsMore(false);
						}}
						onClick={(e) => {
							e.stopPropagation();
							setIsMore(false);
						}}
						tabIndex={0}
					>
						Xem thêm &#8744;
					</span>
				) : null}
			</div>
		</div>
	);
};

export default FilterBoxMobile;
