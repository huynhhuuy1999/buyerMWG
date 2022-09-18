import { ImageCustom, Spin } from 'components';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '@/hooks/useAppSelector';
import { currentUserSelector } from '@/store/reducers/authSlice';
import { numberWithCommas } from '@/utils/formatter';

interface ICardVariantProduct {
	image?: string;
	text?: string;
	price?: number;
	priceDiscount?: number;
	percentDiscount?: number;
	className?: string;
	handleUpdateQuantityCart?: (quantity: number) => void;
	handleAddCard?: any;
	defaultQuantity?: number;
	isInCart?: boolean;
	loadingAddCart?: boolean;
	loading?: boolean;
	onClickImage?: () => void;
	quantityOrigin?: number;
}

const TYPE_CHANGE = {
	INCREASE: 1,
	DECREASE: 2,
};

export const CardVariantProduct: React.FC<ICardVariantProduct> = ({
	image = '',
	text,
	percentDiscount,
	price,
	priceDiscount,
	className,
	handleUpdateQuantityCart,
	handleAddCard,
	defaultQuantity = 1,
	isInCart = false,
	loading,
	onClickImage,
	quantityOrigin,
}) => {
	const [quantity, setQuantity] = useState<number>(defaultQuantity);
	const [quantityRerender, setQuantityRerender] = useState<number>(defaultQuantity);
	const [flag, setFlag] = useState<number>(0);
	const currentUser = useAppSelector(currentUserSelector);

	const handleChangeQuantity = (typeChange: number) => {
		if (typeChange === TYPE_CHANGE.INCREASE) setQuantity(quantity + 1);
		else {
			quantity >= 1 && setQuantity(quantity - 1);
		}
	};

	const deBounceUpdateOnClickQuantity = useRef(
		debounce((item) => {
			if (item < 0) setQuantityRerender(0);
			else setQuantityRerender(item);
			setFlag(flag + 1);
		}, 200),
	).current;

	useEffect(() => {
		if (flag !== 0) {
			handleUpdateQuantityCart?.(quantityRerender);
		}
	}, [quantityRerender, flag]);

	useEffect(() => {
		setQuantity(defaultQuantity);
	}, [defaultQuantity]);

	return (
		<div className={`flex px-2 ${className || ''}`}>
			<div style={{ width: 108, height: 108 }}>
				<ImageCustom
					src={image}
					width={108}
					height={108}
					objectFit='contain'
					priority
					className='object-contain'
					onClick={() => {
						onClickImage?.();
					}}
				/>
			</div>

			<div className='ml-4 grow'>
				<div className='text-16 text-[#333333]'>{text}</div>
				<div className='flex items-center'>
					<span className='font-sfpro_bold text-[#000]'>
						{priceDiscount ? (
							<span>
								{`${numberWithCommas(priceDiscount, '.')}`} <sup>đ</sup>
							</span>
						) : null}
					</span>
					{price ? (
						<span className='ml-1 mr-[1px] text-12 text-[#666666] line-through'>
							{numberWithCommas(price, '.')}
						</span>
					) : null}
					{percentDiscount ? (
						<span className='text-12 text-[#009908]'>-{percentDiscount}%</span>
					) : null}
				</div>
				<div className='mt-5 flex justify-end'>
					{isInCart ? (
						<div className='flex w-[122px]'>
							{loading ? (
								<div className='flex w-[150px] items-center rounded-[4px] border border-[#E0E0E0] px-[10px] py-[5px]'>
									<Spin />
								</div>
							) : (
								<>
									<div
										className='flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-l-3px bg-[#FB6E2E]'
										role='button'
										onClick={(e) => {
											e.stopPropagation();
											handleChangeQuantity(TYPE_CHANGE.DECREASE);
											deBounceUpdateOnClickQuantity(quantity - 1);
										}}
										onKeyPress={(e) => {
											e.stopPropagation();
											handleChangeQuantity(TYPE_CHANGE.DECREASE);
										}}
										tabIndex={0}
									>
										<ImageCustom src='/static/svg/minusWhite.svg' width={8} height={8} priority />
									</div>

									<div className='flex grow items-center justify-center border-y border-[#f1f1f1]'>
										{quantity}
									</div>
									<div
										className='flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-r-3px bg-[#FB6E2E]'
										role='button'
										onClick={(e) => {
											e.stopPropagation();
											handleChangeQuantity(TYPE_CHANGE.INCREASE);
											deBounceUpdateOnClickQuantity(quantity + 1);
										}}
										onKeyPress={(e) => {
											e.stopPropagation();
											handleChangeQuantity(TYPE_CHANGE.INCREASE);
										}}
										tabIndex={0}
									>
										<ImageCustom src='/static/svg/plusWhite.svg' width={16} height={16} priority />
									</div>
								</>
							)}
						</div>
					) : quantityOrigin ? (
						<button
							className='flex w-[150px] items-center rounded-[4px] border border-[#E0E0E0] px-[10px] py-[5px]'
							onClick={(e) => {
								e.stopPropagation();
								// setInCart(true);
								handleAddCard?.();
								setQuantity(1);
								setQuantityRerender(1);
								setFlag(0);
							}}
						>
							{loading ? (
								<Spin />
							) : (
								<>
									<span className='mr-[6px]'>Thêm vào giỏ</span>
									<ImageCustom
										src={'/static/svg/plus.svg'}
										width={16}
										height={16}
										className='ml-[6px]'
									/>
								</>
							)}
						</button>
					) : (
						<div className='w-full flex flex-col'>
							<div className='flex justify-between items-center w-full'>
								<span className='text-16 text-[#EA001B] font-sfpro_bold'>Hết hàng</span>
								<button
									className='flex justify-center w-[150px] items-center rounded-[4px] border border-[#E0E0E0] px-[10px] py-[5px]'
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<span className='mr-[6px]'>Nhắc nhở</span>
								</button>
							</div>
							{!quantityOrigin ? (
								<span className='text-[12px] text-[#727272] w-full'>
									{currentUser?.fullName} sẽ nhận được thông báo khi mặt hàng này có trở lại trong
									kho.
								</span>
							) : null}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
