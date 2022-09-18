import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import Link from 'next/link';
import { CSSProperties, useMemo } from 'react';
import { numberWithCommas } from 'utils';

interface ICategoryProductCard {
	image?: string;
	description?: string;
	className?: string;
	classBg?: string;
	classDescription?: string;
	classImage?: string;
	classPrice?: string;
	classPriceLineThrough?: string;
	classPercentDiscount?: string;
	price?: string | number;
	priceDiscount?: number;
	percentDiscount?: number;
	sold?: number;
	totalQuantity?: number;
	viewer?: number;
	type:
		| 'CATEGORY_PRODUCT_SMALL'
		| 'CATEGORY_PRODUCT_NORMAL'
		| 'DEAL_SOCK_CARD'
		| 'LIVESTREAM_CARD'
		| 'NEW_PRODUCT_CARD'
		| 'CATEGORY_PRODUCT_HOMEPAGE'
		| 'CATEGORY_PRODUCT_HOMEPAGE_SMALL';
	width?: number | string;
	height?: number | string;
	styles?: CSSProperties;
	onClick?: () => void;
	path?: string;
}

interface typeStyle {
	block?: string;
	image: string;
	description?: string;
	price?: string;
	percentDiscount?: string;
	discountLinethrought?: string;
	width?: string | number;
	height?: string | number;
}

const TYPE = {
	categoryProductSmall: 'CATEGORY_PRODUCT_SMALL',
	categoryProductNormal: 'CATEGORY_PRODUCT_NORMAL',
	dealsockCard: 'DEAL_SOCK_CARD',
	livestreamCart: 'LIVESTREAM_CARD',
	newProductCard: 'NEW_PRODUCT_CARD',
	categoryProductHomepage: 'CATEGORY_PRODUCT_HOMEPAGE',
	categoryProductHomepageSmall: 'CATEGORY_PRODUCT_HOMEPAGE_SMALL',
};

const CategoryProductCard: React.FC<ICategoryProductCard> = (props: ICategoryProductCard) => {
	const {
		image,
		description,
		className,
		classDescription,
		classImage,
		classBg = '#fff5f8',
		classPrice,
		classPercentDiscount,
		classPriceLineThrough,
		price,
		priceDiscount,
		// percentDiscount,
		sold,
		totalQuantity,
		// viewer,
		type,
		width,
		height,
		styles,
		onClick,
		path = '',
	} = props || {};

	const transformProcess = useMemo(() => {
		if (sold && totalQuantity) {
			return (sold * 100) / totalQuantity;
		}
		return;
	}, [sold, totalQuantity]);

	const checkType = useMemo(() => {
		let style: typeStyle = {
			block: '',
			image: '',
			description: '',
			price: '',
			discountLinethrought: '',
			percentDiscount: '',
			width: 0,
			height: 0,
		};
		switch (type) {
			case TYPE.categoryProductNormal:
				style = {
					block: `w-20 p-0 ${className || ''}`,
					description: `text-black opacity-50 line-clamp-2 ${classDescription}`,
					image: `${classImage}`,
					width: '80',
					height: '80',
				};
				break;
			case TYPE.categoryProductHomepage:
				style = {
					block: `w-16 p-0 ${className || ''}`,
					description: `text-[#666666] line-clamp-2 ${classDescription}`,
					image: `${classImage} w-16 h-16 rounded-full`,
					width: '64',
					height: '64',
				};
				break;
			case TYPE.categoryProductHomepageSmall:
				style = {
					block: `w-61px p-0 ${className || ''}`,
					description: `text-[#666666] line-clamp-2 ${classDescription}`,
					image: `${classImage} w-[62px] h-[62px] rounded-full`,
					width: '62px',
					height: '62px',
				};
				break;
			case TYPE.categoryProductSmall:
				style = {
					block: `w-[79px] p-0 rounded-4px ${className || ''}`,
					description: `text-6E6E70 line-clamp-2 mt-1 ${classDescription}`,
					image: `rounded-4px ${classImage} w-[79px] h-[79px]`,
					width: '79px',
					height: '79px',
				};
				break;
			case TYPE.dealsockCard:
				style = {
					block: `w-170px pb-5 ${className || ''}`,
					image: `${classImage} w-[170px] h-[170px]`,
					price: `font-bold text-18 mt-1 ${classPrice}`,
					discountLinethrought: `font-medium text-16 line-through text-828282 ${classPriceLineThrough}`,
					percentDiscount: `bg-gradient-to-r from-FF7A00 to-E34400 pt-1 pl-2 pb-1 pr-4 text-white w-51 flex items-center justify-center ${classPercentDiscount}`,
					width: '170',
					height: '170',
				};
				break;
			case TYPE.livestreamCart:
				style = {
					block: `w-52 p-0 rounded-md ${className || ''}`,
					image: `rounded-md ${classImage} w-[52px] h-[252px]`,
					width: '52',
					height: '252',
				};
				break;
			case TYPE.newProductCard:
				style = {
					block: `w-207px h-298px ${className || ''}`,
					image: `${classImage} w-[207px] h-[207px]`,
					description: `text-6E6E70 text-16 line-clamp-1 px-6 w-11/12 ${classDescription}`,
					price: `font-semibold text-18 text-272728 my-1 ${classPrice}`,
					percentDiscount: `bg-yellow-400 flex justify-center text-272728 w-40px h-5 items-center ${classPercentDiscount}`,
					width: '207',
					height: '207',
				};
				break;
			default:
				break;
		}
		return style;
	}, [
		type,
		classDescription,
		classImage,
		classPrice,
		classPercentDiscount,
		className,
		classPriceLineThrough,
	]);

	return (
		<Link href={path} passHref>
			<a
				title={description}
				className={`relative flex h-full cursor-pointer flex-col items-center bg-white ${checkType.block}
            `}
				onClick={onClick}
				onKeyPress={onClick}
				tabIndex={0}
				role='button'
				style={{ width, height, ...styles }}
			>
				<div
					className={classNames(
						[classBg],
						[
							type === TYPE.categoryProductSmall && 'rounded-4px',
							type === TYPE.categoryProductHomepage && 'w-16 h-16 rounded-full text-center',
							type === TYPE.categoryProductHomepageSmall &&
								'rounded-full w-[62px] text-center h-[62px] flex justify-center',
						],
					)}
					style={{ width: checkType.width, maxHeight: checkType.height }}
				>
					<ImageCustom
						src={image || EmptyImage}
						alt=''
						loading='lazy'
						isBlur={false}
						fixedBg={classBg}
						className={classNames('object-cover hover:opacity-90 opacity-100', checkType.image)}
					/>
				</div>
				{[
					TYPE.categoryProductNormal,
					TYPE.categoryProductSmall,
					TYPE.newProductCard,
					TYPE.categoryProductHomepage,
					TYPE.categoryProductHomepageSmall,
				].includes(type) &&
					description && (
						<span className={`${checkType.description} mt-1 text-center text-12 md:text-14`}>
							{description}
						</span>
					)}
				{(type === TYPE.dealsockCard || type === TYPE.newProductCard) && price && (
					<div className={`${checkType.price}`}>
						<span className=''>{numberWithCommas(price, '.')}</span>
						<sup>đ</sup>
					</div>
				)}
				{(type === TYPE.dealsockCard || type === TYPE.newProductCard) && priceDiscount && (
					<div className={`text-16 font-medium text-828282 line-through`}>
						<span className=''>{numberWithCommas(priceDiscount, '.')}</span>
					</div>
				)}
				{type === TYPE.dealsockCard && sold && (
					<div className='relative mt-1 flex h-6 w-11/12 justify-center rounded-20px bg-FFE4D8'>
						<div
							className='absolute top-0 left-0 z-0 h-6 rounded-20px bg-gradient-to-r from-FF7A00 to-E34400 text-16'
							style={{
								width: transformProcess
									? transformProcess === 100
										? '100%'
										: `${transformProcess}%`
									: 0,
							}}
						></div>
						<span className='z-10 text-16'>{`Đã bán ${sold}`}</span>
					</div>
				)}
			</a>
		</Link>
	);
};

export default CategoryProductCard;
