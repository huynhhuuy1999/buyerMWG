import { IPropertyOrther } from 'models';
import React, { useState } from 'react';

import { CheckCard, ImageCustom } from '..';

interface IBoxFilterCard {
	data: IPropertyOrther;
	limitBox: number;
	className?: string;
	onSelect: (val: { id: string; label: string }) => void;

	listSelected: Array<any>;
}

const FilterBoxCard: React.FC<IBoxFilterCard> = ({
	data,
	limitBox,
	onSelect,
	className = '',
	listSelected,
}) => {
	const [numLimitBox, setNumLimitBox] = useState(limitBox);

	const convertValues = () => data.propertyValues?.slice(0, numLimitBox);

	return (
		<div className={className}>
			<div className='flex h-12 items-center bg-F8F8F8 px-3 font-sfpro_semiBold text-16 uppercase text-272728'>
				<span>{data.name}</span>
			</div>
			<div className='flex flex-wrap px-3 pt-4'>
				{(convertValues() ? convertValues() : data.propertyValues)?.map(
					(itemChildren: any, index2: number) => {
						const pos = listSelected.some(
							(itemSelected) => itemSelected.id === itemChildren.getId(),
						);

						return (
							<CheckCard
								title={itemChildren.getName()}
								key={index2}
								onClick={() =>
									onSelect?.({
										id: itemChildren.getId(),
										label: itemChildren.getName(),
									})
								}
								className={`mb-2 ${
									data.name === 'Màu sắc'
										? 'w-[calc(calc(100%_/_5)_-_12px)]'
										: 'w-[calc(calc(100%_/_4)_-_12px)]'
								} !mr-[12px]`}
								checked={pos ?? false}
							>
								{data.name === 'Màu sắc' ? (
									<div className='absolute -top-1px left-0 flex h-10 w-full items-center'>
										<div
											className={`mr-6px aspect-square h-[38px] w-10 rounded-3px `}
											style={{ background: `#${itemChildren.value}` }}
										/>
										<span className='text-ellipsis text-13 line-clamp-2'>
											{itemChildren.getName()}
										</span>
									</div>
								) : (
									<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
										<span className='text-ellipsis text-333333 line-clamp-1'>
											{itemChildren.getName()}
										</span>
									</div>
								)}
							</CheckCard>
						);
					},
				)}
			</div>

			{Array.isArray(data.propertyValues) && data.propertyValues?.length - numLimitBox > 0 ? (
				<div
					className='flex items-center justify-center'
					onClick={(e) => {
						e.stopPropagation();
						setNumLimitBox(data.propertyValues?.length || 0);
					}}
					role='button'
					onKeyPress={() => setNumLimitBox(data.propertyValues?.length || 0)}
					tabIndex={0}
				>
					<span className='text-[#0093E9]'>{`Xem thêm (${
						data.propertyValues.length - numLimitBox
					})`}</span>
					<ImageCustom src={'/static/svg/chevron-down-4834D6.svg'} width={7} height={3} />
				</div>
			) : null}
		</div>
	);
};

export default FilterBoxCard;
