import classNames from 'classnames';
import React from 'react';

import { SelectProps, sizeMap } from '@/components/formField/types';

export const SelectField = React.forwardRef(
	(
		{
			className,
			classNameSelect,
			id,
			label,
			suffixIcon,
			options,
			size = 'base',
			render,
			typeStyleForms,
			labelColor,
			validationMessage,
			...rest
		}: SelectProps,
		ref: any,
	) => {
		return (
			<div className={className} aria-live='polite'>
				<div className={'selectWrapper relative'}>
					<div className='arrowDropdown'>
						{suffixIcon || (
							<img
								loading='lazy'
								src='/static/svg/chevron-down-4834D6.svg'
								alt='iconDown'
								className='absolute right-2 top-2/4 -translate-x-2 -translate-y-2/4'
							/>
						)}
					</div>
					{label && (
						<label
							htmlFor={id}
							className={classNames([
								typeStyleForms && typeStyleForms.labelInsideBorder && 'inputLabelInsideBorder',
								typeStyleForms && typeStyleForms.OnlyborderBottom && 'inputLabelOnlyBorderBottom',
								labelColor,
							])}
						>
							{label}
						</label>
					)}
					<select
						ref={ref}
						id={id}
						aria-label={label}
						value={rest.value}
						onChange={rest.onChange}
						onBlur={rest.onBlur}
						className={classNames([
							'cursor-pointer',
							'min-h-[58px] h-full',
							classNameSelect,
							typeStyleForms && typeStyleForms.OnlyborderBottom
								? 'inputFormBorderBottom'
								: 'inputFormLabelInside',
							sizeMap[
								typeStyleForms && typeStyleForms.OnlyborderBottom ? 'onlyborderBottom' : size
							],
						])}
					>
						<option value={0}>{`<Chọn>`}</option>
						{options &&
							options.map((item: any, i: number) => (
								<option value={item.value} key={i}>
									{item.name}
								</option>
							))}
					</select>
				</div>

				{/* for error */}
				{validationMessage}
			</div>
		);
	},
);

export default SelectField;
