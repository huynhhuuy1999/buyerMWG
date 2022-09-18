import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { CSSProperties, useState } from 'react';
import { numberWithCommas } from 'utils';

interface IDetailProductCard {
	image: string;
	nameProduct?: string;
	stars?: number;
	numRate?: number;
	priceDiscount?: number;
	price?: number;
	avatarShop?: string;
	nameShop?: string;
	isChoose?: boolean; // chọn xem sản phẩm đã được chọn trong giỏ hàng chưa
	priceShip?: number;
	className?: string;
	quantitySelected?: number;
	width?: number | string;
	height?: number | string;
	styles?: CSSProperties;
	classImage?: string;
	stylesImage?: CSSProperties;
	isButton?: boolean; // hiển thị nút mua ngay
	stylesNameShop?: CSSProperties;
	percentDiscount?: number;
	typeIconPercent?: 'DEAL_SHOCK' | 'DEAL_NORMAL'; // chọn type hiển thị icon % giảm giá
	isGuarantee: boolean; //hiển thị icon đảm bảo
}
const TYPE_CHANGE_QUANTITY = {
	PLUS: 1,
	MINUS: 2,
};
const TYPE_ICON_PERCENT = {
	DEAL_SHOCK: 'DEAL_SHOCK',
	DEAL_NORMAL: 'DEAL_NORMAL',
};
const DetailProductCart: React.FC<IDetailProductCard> = (props) => {
	const {
		image,
		isChoose,
		avatarShop,
		numRate,
		nameProduct,
		nameShop,
		price,
		priceDiscount,
		stars,
		priceShip,
		className,
		quantitySelected,
		width,
		height,
		styles,
		classImage,
		stylesImage,
		isButton,
		stylesNameShop,
		percentDiscount,
		typeIconPercent,
		isGuarantee,
	} = props || {};

	const [quantity, setQuantity] = useState(quantitySelected || 0);

	const handleChangeQuantity = (type: number) => {
		switch (type) {
			case TYPE_CHANGE_QUANTITY.PLUS:
				setQuantity(quantity + 1);
				break;
			case TYPE_CHANGE_QUANTITY.MINUS:
				if (quantity > 0) {
					setQuantity(quantity - 1);
				}
				break;
			default:
				break;
		}
	};

	const style = {
		dealsShock:
			'bg-gradient-to-r from-FF7A00 to-E34400 pt-1 pl-2 pb-1 pr-4 text-white w-51 flex items-center justify-center',
		dealNormal: 'bg-yellow-400 flex justify-center text-272728 w-40px h-5 items-center',
	};

	return (
		<div
			className={`bg-white cursor-pointer w-64 p-1 ${className || ''}`}
			style={{ width, height, ...styles }}
		>
			<div className='relative h-64 w-full' style={{ ...stylesImage }}>
				<ImageCustom
					layout='fill'
					loading='lazy'
					src={image}
					alt=''
					className={`object-cover ${classImage}`}
				/>
				<ImageCustom
					width={24}
					height={24}
					src='/assets/images/icons/heart.svg'
					alt=''
					className='absolute bottom-6px right-6px cursor-pointer'
				/>
				{percentDiscount && (
					<div
						className={`absolute top-0 right-0 rounded-l-2xl rounded-tr-md text-xs font-semibold ${
							typeIconPercent === TYPE_ICON_PERCENT.DEAL_SHOCK ? style.dealsShock : style.dealNormal
						}`}
					>
						{typeIconPercent === TYPE_ICON_PERCENT.DEAL_SHOCK && (
							<img loading='lazy' src='/assets/images/icons/lighting.svg' alt='' />
						)}{' '}
						<span className='leading-none'>{`-${percentDiscount}%`}</span>
					</div>
				)}
			</div>

			<div className='mb-21px mt-3'>
				<h3 className={`mr-6 text-16 text-6E6E70 line-clamp-1`}>{nameProduct}</h3>
				<div className='mt-6px mb-13px flex items-center text-16'>
					<img loading='lazy' src='/assets/images/icons/star.svg' alt='' />
					<span className='ml-6px text-6E6E70'>{`${stars}  (${numRate})`}</span>
					<span className='ml-2 text-0EB200'>
						{priceShip === 0 ? 'Giao miễn phí' : `Giao hàng ${priceShip}K`}
					</span>
				</div>
				<div className='flex items-center'>
					<span className={`text-18 font-semibold`}>
						{numberWithCommas(price || 0, '.')}
						<sup>đ</sup>
					</span>
					<span className={`ml-2 text-16 text-6E6E70 line-through`}>
						{numberWithCommas(priceDiscount || 0, '.')}
					</span>
				</div>
				<div className='mt-10px flex items-center'>
					<ImageCustom
						width={24}
						height={24}
						loading='lazy'
						src={avatarShop || EmptyImage}
						alt=''
						className='rounded-full object-cover'
					/>
					<span
						className='ml-5px max-w-120px text-16 text-9F9F9F line-clamp-1 '
						style={{ ...stylesNameShop }}
					>
						{nameShop}
					</span>
					{isGuarantee && (
						<div className='ml-6px flex items-center'>
							<ImageCustom
								loading='lazy'
								src='/assets/images/icons/logoVUIVUi.svg'
								alt=''
								width={14}
								height={14}
							/>
							<span className='ml-1 text-xs font-medium uppercase text-4834D6'>đảm bảo</span>
						</div>
					)}
				</div>
			</div>
			{isChoose ? (
				<div className='flex items-center'>
					<span
						className='flex h-46px w-46px items-center justify-center rounded-lg border border-EDF1F7'
						onClick={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.MINUS)}
						onKeyPress={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.MINUS)}
						tabIndex={0}
						role='button'
					>
						<img loading='lazy' src='/assets/images/icons/minus.svg' alt='' />
					</span>
					<span className='ml-2px flex h-46px w-46px items-center justify-center rounded-lg border border-EDF1F7 text-16'>
						{quantity}
					</span>
					<span
						className='ml-2px flex h-46px w-46px items-center justify-center rounded-lg border border-EDF1F7'
						onClick={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.PLUS)}
						onKeyPress={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.MINUS)}
						tabIndex={0}
						role='button'
					>
						<img loading='lazy' src='/assets/images/icons/plus.svg' alt='' />
					</span>
					<img loading='lazy' src='/assets/images/icons/tick.svg' alt='' className='ml-13px' />
					<span className='ml-2px text-0EB200'>Đã chọn</span>
				</div>
			) : isButton ? (
				<button className='h-46px w-full rounded-100px  border border-E7E7E8 text-20 text-4834D6'>
					Mua ngay
				</button>
			) : (
				<></>
			)}
		</div>
	);
};

export default DetailProductCart;
