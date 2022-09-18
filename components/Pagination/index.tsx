import React, { useMemo, useState } from 'react';

enum SkipType {
	Pre = 'Pre',
	Next = 'Next',
}

interface PaginationProps {
	page: number;
	pageSize?: number;
	totalObject: number;
	skipRange?: number;
	siblingCount?: number;
	className?: string;
	isHidden?: boolean;
	onChange?: (page: number, pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	page,
	pageSize = 40,
	totalObject,
	skipRange = 5,
	siblingCount = 1,
	className,
	isHidden,
	onChange,
}) => {
	const firstPageIndex: number = 1;
	const totalPage: number = Math.ceil(totalObject / pageSize);
	const isDisplay: boolean = totalObject > pageSize;
	const [currentPageIndex] = useState<number>(page + 1);
	const [skipPre, setSkipPre] = useState<boolean>(false);
	const [skipNext, setSkipNext] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(currentPageIndex);
	const [fromRange, setFromRange] = useState<number>((currentPageIndex - 1) * pageSize + 1);
	const [toRange, setToRange] = useState<number>(
		currentPageIndex * pageSize > totalObject ? totalObject : currentPageIndex * pageSize,
	);

	const changePageIndex = (pageIndex: number) => {
		if (pageIndex >= firstPageIndex && pageIndex <= totalPage) {
			setCurrentPage(pageIndex);
			setFromRange((pageIndex - 1) * pageSize + 1);
			setToRange(pageIndex * pageSize > totalObject ? totalObject : pageIndex * pageSize);
			onChange && onChange(pageIndex - 1, pageSize);
		}
	};

	const setRange = (start: number, end: number) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, index) => index + start);
	};

	const paginationItems: (number | SkipType)[] | undefined = useMemo(() => {
		const totalPageIndex: number = siblingCount + 5;
		const leftSiblingIndex: number = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex: number = Math.min(currentPage + siblingCount, totalPage);
		const showSkipPre: boolean = leftSiblingIndex > 2;
		const showSkipNext: boolean = rightSiblingIndex < totalPage - 2;

		// Case 1
		if (totalPageIndex >= totalPage) {
			return setRange(1, totalPage);
		}

		// Case 2
		if (!showSkipPre && showSkipNext) {
			const leftItemCount: number = 3 + 2 * siblingCount;
			const leftRange: number[] = setRange(1, leftItemCount);
			return [...leftRange, SkipType.Next, totalPage];
		}

		// Case 3
		if (showSkipPre && !showSkipNext) {
			const rightItemCount: number = 3 + 2 * siblingCount;
			const rightRange: number[] = setRange(totalPage - rightItemCount + 1, totalPage);
			return [firstPageIndex, SkipType.Pre, ...rightRange];
		}

		// Case 4
		if (showSkipPre && showSkipNext) {
			const middleRange: number[] = setRange(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, SkipType.Pre, ...middleRange, SkipType.Next, totalPage];
		}
	}, [totalObject, pageSize, siblingCount, currentPage]);

	const PreButton: React.FC = () => {
		return (
			<>
				{currentPage !== firstPageIndex ? (
					<img
						loading='lazy'
						className='h-auto w-5 cursor-pointer'
						src='/static/svg/chevron-left-f05a94.svg'
						onClick={() => changePageIndex(currentPage - 1)}
						onKeyPress={() => changePageIndex(currentPage - 1)}
						tabIndex={0}
						role='presentation'
						alt='vuivui chevron'
					/>
				) : (
					<img
						loading='lazy'
						className='h-auto w-5 cursor-not-allowed'
						src='/static/svg/chevron-left-d2d2d2.svg'
						alt='vuivui chevron'
					/>
				)}
			</>
		);
	};

	const NextButton: React.FC = () => {
		return (
			<>
				{currentPage !== totalPage ? (
					<img
						loading='lazy'
						className='h-auto w-5 cursor-pointer'
						src='/static/svg/chevron-right-f05a94.svg'
						onClick={() => changePageIndex(currentPage + 1)}
						onKeyPress={() => changePageIndex(currentPage + 1)}
						tabIndex={0}
						role='presentation'
						alt='vuivui chevron'
					/>
				) : (
					<img
						loading='lazy'
						className='h-auto w-5 cursor-not-allowed'
						src='/static/svg/chevron-right-d2d2d2.svg'
						alt='vuivui chevron'
					/>
				)}
			</>
		);
	};

	const SkipPreButton: React.FC = () => {
		return (
			<>
				{currentPage - skipRange >= firstPageIndex && (
					<div
						onMouseEnter={() => setSkipPre(true)}
						onMouseLeave={() => setSkipPre(false)}
						role='button'
						tabIndex={0}
					>
						{skipPre ? (
							<img
								loading='lazy'
								className='h-auto w-4 cursor-pointer'
								src='/static/svg/chevron-double-left-126bfb.svg'
								onClick={() => changePageIndex(currentPage - skipRange)}
								onKeyPress={() => changePageIndex(currentPage - skipRange)}
								tabIndex={0}
								role='presentation'
								alt='vuivui chevron'
							/>
						) : (
							<img
								loading='lazy'
								className='h-auto w-4 cursor-pointer'
								src='/static/svg/three-dots-3e3e40.svg'
								alt='vuivui chevron'
							/>
						)}
					</div>
				)}
			</>
		);
	};

	const SkipNextButton: React.FC = () => {
		return (
			<>
				{currentPage + skipRange <= totalPage && (
					<div
						onMouseEnter={() => setSkipNext(true)}
						onMouseLeave={() => setSkipNext(false)}
						role='button'
						tabIndex={0}
					>
						{skipNext ? (
							<img
								loading='lazy'
								className='h-auto w-4 cursor-pointer'
								src='/static/svg/chevron-double-right-126bfb.svg'
								onClick={() => changePageIndex(currentPage + skipRange)}
								onKeyPress={() => changePageIndex(currentPage + skipRange)}
								tabIndex={0}
								role='presentation'
								alt='vuivui chevron'
							/>
						) : (
							<img
								loading='lazy'
								className='h-auto w-4 cursor-pointer'
								src='/static/svg/three-dots-3e3e40.svg'
								alt='vuivui threedots'
							/>
						)}
					</div>
				)}
			</>
		);
	};

	return (
		<>
			{isDisplay && (
				<div className='flex items-center justify-between'>
					<label
						className={`font-sfpro text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#333333] ${
							isHidden ? 'hidden' : ''
						}`}
					>
						Hiển thị {fromRange}-{toRange} trong số {totalObject} giá trị
					</label>
					<ul className={`flex items-center space-x-1 ${className || ''}`}>
						<PreButton />
						{paginationItems &&
							paginationItems.map((pageNumber, i: number) => {
								if (pageNumber === SkipType.Pre) {
									return <SkipPreButton key={i} />;
								}

								if (pageNumber === SkipType.Next) {
									return <SkipNextButton key={i} />;
								}

								return (
									<li
										key={i}
										className={
											pageNumber === currentPage
												? 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[#F05A94]'
												: 'flex h-8 w-8 cursor-pointer items-center justify-center'
										}
										onClick={() => changePageIndex(pageNumber)}
										onKeyPress={() => changePageIndex(pageNumber)}
										tabIndex={0}
										role='presentation'
									>
										<span
											className={
												pageNumber === currentPage
													? 'font-sfpro text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-white'
													: 'font-sfpro text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#3E3E40] hover:scale-110 hover:text-[#F05A94]'
											}
										>
											{pageNumber}
										</span>
									</li>
								);
							})}
						<NextButton />
					</ul>
				</div>
			)}
		</>
	);
};
export default Pagination;
