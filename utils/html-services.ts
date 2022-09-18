// Libraries
// Constants
import { contentTypes } from 'enums';
// Types
import type { ColumnRender, ContentRender, ContentValues, DesignData, RowRender } from 'models';
import moment from 'moment';

export const purifyStringHTML = (str: string | undefined = '') => {
	return str.replace(/\t|\n/g, ' ').replace(/\s\s+/g, ' ').trim();
};

export const hierarchyDesignData = (data: DesignData) => {
	const body = data?.bodies;
	let bodyValues: Record<string, any> = {};
	const rows: RowRender[] = [];
	let rowPositions: string[] = [];

	for (const key in body) {
		bodyValues = data?.bodies[key]?.values;
		rowPositions = data?.bodies[key]?.rows;
	}

	rowPositions?.length &&
		rowPositions.forEach((row) => {
			const columnKeys = data?.rows[row]?.columns;
			const columns = columnKeys?.length
				? columnKeys.map((columnKey) => {
						let column: ColumnRender = {
							id: '',
							location: {
								collection: '',
								id: '',
							},
							contents: [],
							values: {},
						};
						for (const key in data?.columns) {
							if (key === columnKey) {
								const contentKeys = data?.columns[key]?.contents;
								const contents = contentKeys?.length
									? contentKeys.map((contentKey) => {
											let content: ContentRender = {
												type: '',
												location: {
													collection: '',
													id: '',
												},
												values: {},
												id: '',
											};
											for (const key in data?.contents) {
												if (key === contentKey) {
													content = {
														type: data?.contents[key]?.type ?? '',
														location: data?.contents[key].location,
														values: data?.contents[key]?.values,
														id: data?.contents[key].id,
													};
												}
											}
											return content;
									  })
									: [];
								column = {
									contents: contents,
									id: data?.columns[key].id,
									location: data?.columns[key].location,
									values: data?.columns[key]?.values,
								};
							}
						}
						return column;
				  })
				: [];

			rows.push({
				cells: data?.rows[row]?.cells ?? [],
				values: data?.rows[row]?.values ?? {},
				columns: columns ?? [],
				location: data?.rows[row]?.location,
				id: data?.rows[row]?.id,
			});
		});

	const nestedData = {
		body: {
			rows: rows,
			values: bodyValues,
		},
		counters: data?.idCounters,
		schemaVersion: data?.schemaVersion,
	};
	return nestedData;
};

export const getContentData = (data: DesignData, element: string) => {
	const { contents } = data;
	const listContent = Object.values(contents);

	return listContent?.length
		? listContent.find((item) => item?.values && item?.values?._meta?.htmlID === element)
		: undefined;
};

export const getRowData = (data: DesignData, element: string) => {
	const { rows } = data;

	return Object.values(rows)?.length
		? Object.values(rows).find((row) => row?.values && row?.values?._meta?.htmlID === element)
		: undefined;
};

export const insertAt = (arr: string | any[], index: any, newItem: any) => [
	...arr.slice(0, index),
	newItem,
	...arr.slice(index),
];

export const updateUsageCounters = (usageCounters: any, htmlType: any, operator = '+') => {
	const newUsageCounters = { ...usageCounters };

	if (operator === '-') {
		switch (htmlType) {
			case contentTypes.ROW:
				newUsageCounters.u_row--;
				break;
			case contentTypes.COLUMN:
				newUsageCounters.u_column--;
				break;
			case contentTypes.BUTTON:
				newUsageCounters.u_content_button--;
				break;
			case contentTypes.DIVIDER:
				newUsageCounters.u_content_divider--;
				break;
			case contentTypes.IMAGE:
				newUsageCounters.u_content_image--;
				break;
			case contentTypes.MENU:
				newUsageCounters.u_content_menu--;
				break;
			case contentTypes.SOCIAL:
				newUsageCounters.u_content_social--;
				break;
			case contentTypes.TEXT:
				newUsageCounters.u_content_text--;
				break;
			case contentTypes.HTML:
				newUsageCounters.u_content_html--;
				break;
			default:
				break;
		}
	}
	if (operator === '+') {
		switch (htmlType) {
			case contentTypes.ROW:
				newUsageCounters.u_row++;
				break;
			case contentTypes.COLUMN:
				newUsageCounters.u_column++;
				break;
			case contentTypes.BUTTON:
				newUsageCounters.u_content_button++;
				break;
			case contentTypes.DIVIDER:
				newUsageCounters.u_content_divider++;
				break;
			case contentTypes.IMAGE:
				newUsageCounters.u_content_image++;
				break;
			case contentTypes.MENU:
				newUsageCounters.u_content_menu++;
				break;
			case contentTypes.SOCIAL:
				newUsageCounters.u_content_social++;
				break;
			case contentTypes.TEXT:
				newUsageCounters.u_content_text++;
				break;
			case contentTypes.HTML:
				newUsageCounters.u_content_html++;
				break;
			default:
				break;
		}
	}
	return newUsageCounters;
};

export const getLastUsingId = (data: DesignData) => {
	const contentIdList = Object.keys(data.contents);
	const lastContentID = contentIdList?.length ? contentIdList[contentIdList.length - 1] : 0;

	const columnIdList = Object.keys(data.columns);
	const lastColumnID = columnIdList?.length ? columnIdList[columnIdList.length - 1] : 0;

	const rowIdList = Object.keys(data.rows);
	const lastRowID = rowIdList?.length ? rowIdList[rowIdList.length - 1] : 0;

	return Math.max(
		parseInt(lastContentID.toString()),
		parseInt(lastColumnID.toString()),
		parseInt(lastRowID.toString()),
	);
};

export const getIdCounterNumberByName = (data: DesignData, htmlClassNames: string): number => {
	return data.idCounters[htmlClassNames];
};

export const getDomByAttr = (queryAttr: any, draggableId: any) => {
	const domQuery = `[${queryAttr}='${draggableId}']`;
	const draggedDOM = document.querySelector(domQuery);

	return draggedDOM;
};

const switchContents = (type: string, values: ContentValues) => {
	const {
		text,
		lineHeight,
		borderRadius,
		textAlign,
		border,
		src,
		padding,
		buttonColors,
		color,
		href,
	} = values;
	const isBordered = !!(border && Object.keys(border).length);
	const borderTop = isBordered
		? `border-top: ${border.borderTopWidth} ${border.borderTopStyle} ${border.borderTopColor}`
		: '';
	const borderRight = isBordered
		? `border-right: ${border.borderRightWidth} ${border.borderRightStyle} ${border.borderRightColor}`
		: '';
	const borderBottom = isBordered
		? `border-bottom: ${border.borderBottomWidth} ${border.borderBottomStyle} ${border.borderBottomColor}`
		: '';
	const borderLeft = isBordered
		? `border-left: ${border.borderLeftWidth} ${border.borderLeftStyle} ${border.borderLeftColor}`
		: '';

	switch (type) {
		case contentTypes.DIVIDER:
			return `
				<div
					style='
					text-align:${textAlign ?? 'left'};
					line-height: 0px;
					'
				>
				<div
				style='
					border: ${border?.borderTopWidth} ${border?.borderTopStyle} ${border?.borderTopColor};
					vertical-align: middle;
				'
				>

				</div>
				</div>
			`;
		case contentTypes.BUTTON:
			return `${
				href?.values.href
					? `<div style='text-align:${textAlign ?? 'left'};'><a href='${
							href?.values.href
					  }' rel='noreferrer' target='${href?.values.target}' style='
			color: ${buttonColors?.color ?? '#000'};
			display: inline-block;
			line-height: ${lineHeight ?? '100%'};
			border-radius: ${borderRadius ?? '0px'};
			text-align: center;
			padding: ${padding ?? '0px'};
			background-color: ${buttonColors?.backgroundColor || 'unset'};
			color: ${buttonColors?.color ?? '#000'};
			width: auto;
			max-width: 100%;
			display: inline-block;
			overflow-wrap: break-word; 
			position: relative;
			cursor: pointer;
			${borderTop};  
			${borderRight};  
			${borderBottom};  
			${borderLeft}; 
			line-height:100%;
		'>
			${text ?? ''}

		</a></div>`
					: `<div style='text-align:${textAlign ?? 'left'};'>
		<span 
			style='
				line-height: ${lineHeight ?? '100%'};
				border-radius: ${borderRadius ?? '0px'};
				text-align: center;
				padding: ${padding ?? '0px'};
				background-color: ${buttonColors?.backgroundColor || 'unset'};
				color: ${buttonColors?.color ?? '#000'};
				width: auto;
				max-width: 100%;
				display: inline-block;
				overflow-wrap: break-word; 
				position: relative;
				cursor: pointer;
				${borderTop};  
				${borderRight};  
				${borderBottom};  
				${borderLeft}; 
			'
		>
			${text}
		</span>
	</div>`
			}  `;
		case contentTypes.IMAGE:
			return `
				<div
					style='
						text-align:${textAlign ?? 'center'};
						line-height: 0px;
					'
				>
					<img src='${src?.url}' alt='${values?.altText}'
						style='
							width: 100%;
							max-width: ${src?.width ? src.width + 'px' : '100%'};
						'
					/>

				</div>
			`;
		case contentTypes.TEXT:
			return `<div
				style='
					color: ${color ?? '#000'}; 
					line-height: ${lineHeight ?? '100%'}; 
					text-align: ${textAlign ?? 'center'}; 
					overflow-wrap: break-word;
				'
			>
				${text ?? ''}
			</div>`;
		case contentTypes.VOUCHER:
			return `
			<div style='padding: 10px'>
				<div style='position: relative; max-width: 580px;'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					xmlns-xlink='http://www.w3.org/1999/xlink'
					view-box='0 0 604 132'
					style='
						width: 100%;
						height: 132px;
						filter: drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px);
					'
				>
					<g fill='none' fill-rule='evenodd'>
						<g>
							<g>
								<g>
									<g>
										<g>
											<g transform='translate(-3160 -2828) translate(3118 80) translate(42 2487) translate(0 140) translate(0 85) translate(0 36)'>
												<path
													fill='#FFF'
													d='M596 0c4.418 0 8 3.582 8 8v116c0 4.418-3.582 8-8 8H140.5c0-4.419-3.582-8-8-8s-8 3.581-8 8H8c-4.418 0-8-3.582-8-8V8c0-4.418 3.582-8 8-8h116.5c0 4.418 3.582 8 8 8s8-3.582 8-8H392z'
												></path>
												<g stroke='#EEE' stroke-dasharray='2 4' stroke-linecap='square' mask='url(#14s2l20tnb)'>
													<path d='M0.5 0L0.5 114' transform='translate(132 11)'></path>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</g>
					</g>
				</svg>
				<div style='
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					width: 100%;
				'>
					<div style='
						width: 132px;
						height: 132px;
						display: flex;
						justify-content: center;
						align-items: center;
					'>
						<img src='${values?.voucher?.image}' alt='${values?.voucher?.altText}' width='60' height='60' />
					</div>
					<div style='
						width: calc(100% - 132px);
						padding: 10px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					'>
						<div style='width: 100%;'>
							<div style='
								width: 100%;
								display: flex;
								justify-content: space-between;
								align-items: center;	
							'>
								<div>
									<div style='
										padding: 1px 4px;
										background-color: rgb(218, 249, 249);
										border-radius: 4px;
										color: rgb(74, 126, 231);
									'>KH mới</div>
								</div>

								<div>
								<svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="16px" height="16px" fill="#888" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg>
								</div>
							</div>
							<div style='
								font-size: 16px;
								font-weight: 600;
								margin-top: 4px;
							'>${values?.voucher?.title}</div>
							<div >Cho đơn hàng từ ${values?.voucher?.minOrder}đ</div>
						</div>
						<div style='
							display: flex;
							justify-content: space-between;
						'>
							<div>HSD: ${moment(values?.voucher?.expiredDate).format('DD/MM/YYYY')}</div>
							<div id='${values?.voucher?.voucherId}'>
								<button 
									style='
										border-radius: 4px;
										outline: none;
										border: none;
										background-color: rgb(67, 81, 238);
										color: #fff;
										padding: 4px 20px;
										cursor: pointer;
									'
								>Lưu</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
			`;
		default:
			return '<div>no content</div>';
	}
};

export const exportHTML = (designData: DesignData) => {
	const pageString: { key: string; value: string }[] = [];

	const nestedData = hierarchyDesignData(designData);

	const generateContents = (contents: ContentRender[]) => {
		return contents?.length
			? contents
					.map((content) => {
						const { type, values } = content;
						const { _meta, containerPadding } = values;

						return `
						<div
							id='${_meta?.htmlID}'
							style='
								${containerPadding ? `padding: ${containerPadding};` : ''}
							'
						>
							${switchContents(type, values)}
						</div>
						`;
					})
					.join('')
					.replace(/> *</g, '><')
			: '';
	};

	const generateColumns = (columns: ColumnRender[], cell: number, totalCells: number) => {
		return columns?.length
			? columns
					.map((column) => {
						const { padding, border, backgroundColor } = column.values;

						return `
							<div class="u_column" style="
								width: ${(cell / totalCells) * 100}%;
								
							">
								<div style="
									height: 100%;
									padding: ${padding ?? '0px'};
									${border?.width ? `border-width: ${border?.width}` : ''};
									${border?.width ? `border-style: ${border?.style}` : ''};
									${border?.width ? `border-color: ${border?.color}` : ''};
									${backgroundColor ? `background-color: ${backgroundColor}` : ''}
								">
									<div class=layer-group-content'>
										${generateContents(column.contents)}
									</div>
								</div>
							</div>
						`;
					})
					.join('')
					.replace(/> *</g, '><')
			: '';
	};

	nestedData.body.rows?.length &&
		nestedData.body.rows.forEach((row, index) => {
			const { contentWidth = '600px' } = nestedData.body.values;
			const { padding, backgroundColor, backgroundImage, columnsBackgroundColor } = row.values;
			const totalCells = row.cells.reduce((acc, cur) => acc + cur, 0);

			const rowHtml = `<div
			id='${row.values._meta.htmlID}'
			class="u_row"
			style="
				overflow: hidden;
				padding: ${padding ?? '0px'};
				background-color: ${backgroundColor ?? 'unset'}
			"
		>
			<div class="container" style="
				width:${contentWidth ?? '600px'};
				margin: 0 auto;
				${backgroundImage.url ? `background-image: url(${backgroundImage.url});` : ''}
				${
					backgroundImage.url
						? `background-repeat: ${backgroundImage.repeat ? 'repeat' : 'no-repeat'};`
						: ''
				}
				${
					backgroundImage.url
						? `background-position: ${backgroundImage.center ? 'center top' : 'left top'};`
						: ''
				}
				${columnsBackgroundColor ? `backgroundColor: ${columnsBackgroundColor}` : ''}
			">
				<div style="display: flex;">
					${generateColumns(row.columns, row.cells[index], totalCells)}
				</div>
			</div>
		</div>`;

			pageString.push({
				key: row.values._meta.htmlID,
				value: purifyStringHTML(rowHtml),
			});
		});

	return pageString;
};
