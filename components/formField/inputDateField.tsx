import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

import { InputProps, sizeMap } from '@/components/formField/types';

const InputDateField = React.forwardRef(
	(
		{
			id,
			label,
			type = 'text',
			typeStyleForms,
			size = 'base',
			style,
			placeholder,
			required,
			suffixIcon,
			className,
			validationMessage,
			...rest
		}: InputProps,
		ref: any,
	) => {
		return (
			<div className={classNames([className, 'inputWrapper'])} aria-live='polite'>
				<div className='inputWrapperVuivui relative z-[2]'>
					<input
						id={id}
						type={type}
						aria-label={label}
						ref={ref}
						className={classNames([
							'w-full z-[2]',
							type === 'date' && 'bg-transparent',
							typeStyleForms && typeStyleForms.OnlyborderBottom
								? 'inputFormBorderBottom'
								: 'inputFormLabelInside',
							sizeMap[
								size === 'base' && typeStyleForms && typeStyleForms.OnlyborderBottom
									? 'onlyborderBottom'
									: size
							],
							style?.input,
							rest.disabled && 'grayscale filter cursor-not-allowed bg-[#f6f6f6]',
						])}
						aria-required={required}
						value={rest?.value ? rest.value : ''}
						onChange={rest.onChange}
						disabled={rest.disabled}
					/>
					<input
						className='absolute top-0 left-0 z-[2] w-full opacity-0'
						type='date'
						value={rest?.value ? moment(rest.value as any, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
						onChange={(e) => {
							rest.onChange?.(
								e?.target?.value ? (moment(e.target.value).format('DD/MM/YYYY') as any) : '',
							);
						}}
						max={moment().format('YYYY-MM-DD')}
					/>

					<div
						className={classNames([
							'InputVuivuiPlaceholder',
							typeStyleForms && typeStyleForms.animation && 'inputLabelAnimation',
						])}
					>
						{label} {required ? <span className='inline'>*</span> : ''}
					</div>
					{/* eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values */}
					<label className='absolute right-[2px] top-[30px] z-[1] h-[20px] w-[20px] -translate-y-2/4 -translate-x-[12px] bg-[#ffffff] p-1'>
						{suffixIcon}
					</label>
				</div>

				{/* append error */}
				{validationMessage}
			</div>
		);
	},
);
export default InputDateField;
