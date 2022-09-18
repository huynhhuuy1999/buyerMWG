import { ImageCustom } from 'components';
import React, { useEffect, useRef, useState } from 'react';

interface IPopupSort {
	className?: string;
	onChange?: (value: number) => void;
	defaultValue?: number;
	listDataSort?: { id: number; label: string }[];
}

const dataSortDropdown = [
	{
		id: 0,
		label: 'Mặc định',
	},
	{
		id: 1,
		label: 'Theo giá giảm dần',
	},
	{
		id: 2,
		label: 'Theo giá tăng dần',
	},
	{
		id: 3,
		label: 'Theo % giảm giá giảm dần',
	},
	{
		id: 4,
		label: 'Sản phẩm mới nhất',
	},
	{
		id: 5,
		label: 'Bán chaỵ nhất',
	},
	{
		id: 6,
		label: 'Được yêu thích nhiều nhất',
	},
];

const PopupSort: React.FC<IPopupSort> = ({
	className,
	onChange,
	defaultValue,
	listDataSort = dataSortDropdown,
}) => {
	const [checkType, setCheckType] = useState<{
		id: number;
		label: string;
	}>({ id: -1, label: 'Sắp xếp' });
	const [showSort, setShowSort] = useState<boolean>(false);
	const refSort = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (refSort.current && !refSort.current.contains(event.target)) {
				setShowSort(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [refSort]);

	useEffect(() => {
		if (defaultValue || defaultValue === 0) {
			const typeSort = listDataSort.filter((item) => item.id === defaultValue);
			if (typeSort.length) setCheckType(typeSort[0]);
		}
	}, [defaultValue]);

	return (
		<div
			className='relative flex items-center'
			onClick={() => setShowSort(true)}
			role='button'
			onKeyPress={() => setShowSort(true)}
			tabIndex={0}
			ref={refSort}
		>
			<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />
			<span className='text-14'>{checkType.label}</span>
			{showSort ? (
				<div className={`${className || ''} w-[273px] z-10`}>
					<div className='flex h-12 w-full items-center justify-between rounded-t-[8px] bg-black px-4'>
						<div className='item-center flex'>
							<ImageCustom
								alt=''
								src={'/static/svg/systemIcon_white.svg'}
								width={24}
								height={24}
								priority
							/>
							<span className='ml-[6px] text-16 uppercase text-FFFFFF'>Sắp xếp</span>
						</div>

						<ImageCustom
							alt=''
							src={'/static/svg/close_white.svg'}
							width={24}
							height={24}
							onClick={(e) => {
								e.stopPropagation();
								setShowSort(false);
							}}
							priority
						/>
					</div>
					<div className='rounded-b-[8px] bg-[#263238] py-3'>
						{listDataSort.map((item, index) => {
							const check = item.id === checkType.id;
							return (
								<div
									key={index}
									onClick={(e) => {
										e.stopPropagation();
										setCheckType(item);
										setShowSort(false);
										onChange && onChange(item.id);
									}}
									role='button'
									onKeyPress={() => setCheckType(item)}
									tabIndex={0}
									className={`flex items-center px-4 py-2 ${check ? 'bg-[#7953D2]' : ''}`}
								>
									<ImageCustom
										src={`${check ? '/static/svg/circle_checked.svg' : '/static/svg/circle.svg'}`}
										width={20}
										height={20}
										priority
									/>
									<span className='ml-3 text-FFFFFF'>{item.label}</span>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default PopupSort;
