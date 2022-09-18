// import { useRouter } from 'next/router';
import classNames from 'classnames';
import { TypeModesCartProduct } from 'models';
import React, { useEffect, useState } from 'react';
import { isNumber } from 'utils/methods';

interface InputNumberProps {
	mode?: TypeModesCartProduct;
	minimumValue?: number;
	maximumValue?: number;
	defaultValue?: number;
	disabled?: boolean;
	isLoading?: boolean;
	onChange: (value: number, setValue?: React.Dispatch<React.SetStateAction<any>>) => void;
}

const InputNumber: React.FC<InputNumberProps> = ({
	minimumValue,
	mode,
	maximumValue,
	defaultValue,
	disabled,
	isLoading,
	onChange,
}) => {
	const [value, setValue] = useState<number | string>(1);

	useEffect(() => {
		defaultValue && setValue(defaultValue || 1);
	}, [defaultValue]);

	// const router = useRouter();

	const handleOnClick = async (numberInput: number) => {
		const minimum: number = minimumValue || 0;
		const maximum: number = maximumValue || 99;

		if (numberInput >= minimum && numberInput <= maximum) {
			if (numberInput === 0) {
				setValue(1);
				onChange(0, setValue);
			} else {
				setValue(numberInput);
				onChange(numberInput, setValue);
			}
		}
	};

	const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const value: string = event.target.value;

		if (isNumber(value)) {
			const numberInput: number = Number(value);
			const minimum: number = minimumValue || 0;
			const maximum: number = maximumValue || 99;

			if (numberInput >= minimum && numberInput <= maximum) {
				if (numberInput === 0) {
					setValue(1);
					onChange(0, setValue);
				} else {
					setValue(numberInput);
					onChange(numberInput, setValue);
				}
			}
		} else {
			setValue('');
		}
	};

	return (
		<div
			className={classNames([
				'flex',
				isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100 cursor-auto',
			])}
		>
			{mode === 'CART_BUY_NOW' && (
				<button
					className='box-border h-[32px] w-[40px] rounded-l-md border border-solid border-[#F6F6F6] bg-[#F6F6F6] font-sfpro text-[14px] font-medium not-italic leading-normal tracking-[0.04px] text-[#222B45]'
					onClick={() => handleOnClick(+value - 1)}
				>
					-
				</button>
			)}

			<input
				maxLength={2}
				value={value}
				type={'text'}
				onChange={handleOnChange}
				disabled={disabled || mode === 'CART_BUY_LATER'}
				className={classNames([
					'box-border h-[32px] w-[40px] items-center border border-solid border-[#F6F6F6] bg-white px-[2px] text-center font-sfpro font-medium text-[14px] not-italic leading-normal tracking-[0.04px] text-[#333333] outline-none',
				])}
			/>
			{mode === 'CART_BUY_NOW' && (
				<button
					className='box-border h-[32px] w-[40px] rounded-r-md border border-solid border-[#F6F6F6] bg-[#F6F6F6] font-sfpro text-[14px] font-medium not-italic leading-normal tracking-[0.04px] text-[#333333]'
					onClick={() => handleOnClick(+value + 1)}
				>
					+
				</button>
			)}
		</div>
	);
};

export default InputNumber;
