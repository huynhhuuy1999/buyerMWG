import classNames from 'classnames';
import { RadioField } from 'components';
import { ICartFormProps } from 'models';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

interface ChoosePaymentProps {
	defaultValue?: string | number;
	onClick?: (value: string | number, setState?: React.Dispatch<React.SetStateAction<any>>) => void;
	disabled?: number;
	loading: boolean;
	showTooltip?: boolean;
}

const ChoosePayment: React.FC<ChoosePaymentProps> = ({
	defaultValue,
	onClick,
	disabled,
	loading,
	showTooltip = true,
}) => {
	const { control } = useFormContext<ICartFormProps>();

	const { fields } = useFieldArray({
		control,
		name: 'paymentMethods',
		keyName: 'ids',
	});

	const [typeValue, setTypeValue] = useState<any>();

	useEffect(() => {
		if (!typeValue && defaultValue) {
			setTypeValue(defaultValue);
		}
	}, [defaultValue]);

	useEffect(() => {
		onClick?.(typeValue, setTypeValue);
	}, [typeValue]);

	const handleOnClick = (checkedValue: string | number) => {
		setTypeValue(checkedValue);
	};

	return (
		<div className='grid grid-cols-2 gap-2'>
			{fields?.map((item, _) => (
				<Controller
					key={item.ids}
					render={({ field }) => (
						<div
							className={classNames([
								'cursor-pointer group relative animation-100',
								'flex items-center p-3 border border-solid rounded-lg box-border',
								typeValue === item.id ? 'border-[#FEBEF2] bg-[#F7F5FE]' : 'border-[#E7E7E8]',
								disabled === item.id ? 'grayscale filter pointer-events-none' : 'cursor-pointer',
								loading && !Boolean(typeValue === item.id)
									? 'opacity-60 pointer-events-none'
									: 'opacity-100 cursor-pointer',
							])}
							onClick={() => {
								field.onChange(item.id);
								handleOnClick(item.id);
							}}
							onKeyPress={() => {
								field.onChange(item.id);
								handleOnClick(item.id);
							}}
							tabIndex={0}
							role={'button'}
						>
							<RadioField
								{...field}
								id={String(item.id)}
								render={
									<div
										className={classNames([
											'w-full h-full flex pl-8 cursor-pointer items-center',
											// layouts === 'cart' && item.discount ? 'flex-col' : '',
											// layouts === 'retryPayment' ? 'items-center' : '',
											disabled === item.id
												? 'grayscale filter pointer-events-none'
												: 'cursor-pointer',
										])}
									>
										{item.image && <img className='h-8 w-8' src={item.image} alt='item icon' />}
										<div
											className={classNames([
												'pt-2 pl-1',
												// layouts === 'cart' && item.discount && 'pt-2 pl-1',
												// layouts === 'retryPayment' && 'pl-4',
											])}
										>
											<span className='font-sfpro text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#1A1A1C]'>
												{item.title}
											</span>
											{item.sub && (
												<div className='font-sfpro text-[12px] font-normal not-italic leading-[1.3] tracking-[0.04px] text-[#EB8A26]'>
													{item.sub}
												</div>
											)}
										</div>
									</div>
								}
								checked={typeValue === item.id}
								styles={{ label: 'text-14' }}
								value={item.id}
							/>

							{item.discount && showTooltip && (
								<span className='tooltip-text absolute top-[50%] -left-[100%] z-[60] hidden  w-full -translate-y-[50%] flex-col rounded-[6px] border border-[#e0e0e0] bg-white p-3 shadow-xl group-hover:block'>
									<div className='absolute top-[50%] -right-[8px] -translate-y-[50%] border-y-8 border-l-8 border-r-0 border-solid border-y-transparent border-l-white'></div>
									<div className='pt-2 font-sfpro text-[12px] font-normal not-italic leading-[1.3] tracking-[0.04px] text-[#EB8A26]'>
										tối thiểu: {item.minAmount?.toLocaleString('it-IT')}đ
									</div>
									<div className='pt-2 font-sfpro text-[12px] font-normal not-italic leading-[1.3] tracking-[0.04px] text-[#EB8A26]'>
										tối đa: {item.maxAmount?.toLocaleString('it-IT')}đ
									</div>
								</span>
							)}
						</div>
					)}
					name={'paymentType'}
					control={control}
				/>
			))}
		</div>
	);
};

export default ChoosePayment;
