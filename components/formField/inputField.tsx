import classNames from 'classnames';
import React from 'react';

import { InputProps, sizeMap } from '@/components/formField/types';

const InputField = React.forwardRef(
	(
		{
			id,
			label,
			typeStyleForms,
			type = 'text',
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
				{/* {label && (
					<label
						htmlFor={id}
						className={classNames([
							typeStyleForms && typeStyleForms.labelInsideBorder && 'inputLabelInsideBorder',
							typeStyleForms && typeStyleForms.OnlyborderBottom && 'inputLabelOnlyBorderBottom',
							typeStyleForms && typeStyleForms.animation && 'inputLabelAnimation',
							style?.label,
							rest.disabled && 'grayscale filter pointer-events-none',
						])}
					>
						{label}
					</label>
				)} */}
				<div className='inputWrapperVuivui relative'>
					<input
						id={id}
						type={type}
						aria-label={label}
						ref={ref}
						// placeholder={required ? `${placeholder} *` : placeholder}
						className={classNames([
							type === 'date' && 'bg-white',
							typeStyleForms && typeStyleForms.OnlyborderBottom
								? 'inputFormBorderBottom'
								: 'inputFormLabelInside',
							sizeMap[
								size === 'base' && typeStyleForms && typeStyleForms.OnlyborderBottom
									? 'onlyborderBottom'
									: size
							],
							style?.input,
							rest.disabled && 'grayscale filter',
						])}
						aria-required={required}
						value={rest.value}
						onChange={rest.onChange}
						onBlur={rest.onBlur}
						disabled={rest.disabled}
					/>
					<div
						className={classNames([
							'InputVuivuiPlaceholder',
							typeStyleForms && typeStyleForms.animation && 'inputLabelAnimation',
						])}
					>
						{label} {required ? <span className='inline'>*</span> : ''}{' '}
					</div>
					{/* eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values */}
					<div className='absolute right-[12px] top-2/4 h-[20px] w-[20px] -translate-y-2/4 -translate-x-[12px]'>
						{suffixIcon}
					</div>
				</div>

				{/* append error */}
				{validationMessage}
			</div>
		);
	},
);
export default InputField;
