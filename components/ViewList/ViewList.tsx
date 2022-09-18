import classNames from 'classnames';
import { InterParamsViewList, Pagination, PropsViewList } from 'components';
import { isObjectLike } from 'lodash';
import React from 'react';

const defaultParams = {
	page: 0,
	pageSize: 10,
	totalObject: 0,
};

export const ViewList: React.FC<PropsViewList> = ({
	data,
	pageSize,
	page = defaultParams.page,
	loading,
	setItem,
	setLoadingCard,
	totalObject,
	className,
	changePage,
	isOverFlow = false,
	showPagination = true,
}) => {
	return (
		<>
			<div
				style={{ width: 'fit-content' }}
				className={classNames(
					isOverFlow
						? ['flex flex-nowrap overflow-auto']
						: ['grid grid-cols-4 pb-9 bg-white gap-x-2'],
					className,
				)}
			>
				{!loading ? (
					<>
						{data && data?.length ? (
							data.slice(0, pageSize).map((item: any, index: number) => {
								return isObjectLike(item) ? (
									<React.Fragment key={index}>{setItem(item)}</React.Fragment>
								) : null;
							})
						) : (
							<span>Không có sản phẩm</span>
						)}
					</>
				) : (
					setLoadingCard?.()
				)}
			</div>
			{showPagination && (
				<Pagination
					pageSize={pageSize}
					totalObject={totalObject || defaultParams.totalObject}
					page={page || defaultParams.page}
					onChange={(page, pageSize): InterParamsViewList => changePage?.({ page, pageSize })}
				/>
			)}
		</>
	);
};
