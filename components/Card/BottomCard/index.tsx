import React, { useState } from 'react';

interface IBottomCard {
	inCart?: boolean;
	quantitySelected?: number;
	className?: string;
}

const BottomCard: React.FC<IBottomCard> = ({ inCart, quantitySelected, className }) => {
	const TYPE_CHANGE_QUANTITY = {
		PLUS: 1,
		MINUS: 2,
	};
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
	return (
		<>
			{inCart ? (
				<div className={`flex items-center mt-5 ${className || ''}`}>
					<span
						className='flex h-46px w-46px cursor-pointer items-center justify-center rounded-lg border border-EDF1F7'
						onClick={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.MINUS)}
						onKeyPress={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.MINUS)}
						tabIndex={0}
						role='button'
					>
						<img loading='lazy' src='/static/svg/minus.svg' alt='' />
					</span>
					<span className='ml-2px flex h-46px w-46px items-center justify-center rounded-lg border border-EDF1F7 text-16'>
						{quantity}
					</span>
					<span
						className='ml-2px flex h-46px w-46px cursor-pointer items-center justify-center rounded-lg border border-EDF1F7'
						onClick={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.PLUS)}
						onKeyPress={() => handleChangeQuantity(TYPE_CHANGE_QUANTITY.PLUS)}
						tabIndex={0}
						role='button'
					>
						<img loading='lazy' src='/static/svg/plus.svg' alt='' />
					</span>
					<img loading='lazy' src='/static/svg/tick.svg' alt='' className='ml-13px' />
					<span className='ml-2px text-0EB200'>Đã chọn</span>
				</div>
			) : (
				<button
					className={`text-4834D6 h-46px w-11/12 mt-5 border-E7E7E8 border rounded-100px text-20 mb-2 ${
						className || ''
					}`}
				>
					Mua ngay
				</button>
			)}
		</>
	);
};

export default BottomCard;
