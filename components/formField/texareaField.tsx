import classNames from 'classnames';
import React from 'react';

import { FormTextareaProps, sizeMap } from '@/components/formField/types';

const TextAreaField = React.forwardRef(
	(
		{
			id,
			label,
			size = 'base',
			typeStyleForms,
			className,
			validationMessage,
			...rest
		}: FormTextareaProps,
		ref: any,
	) => {
		return (
			<div className='relative'>
				<label
					htmlFor={id}
					className={classNames([
						typeStyleForms.labelInsideBorder && 'inputLabelInsideBorder',
						typeStyleForms.OnlyborderBottom && 'inputLabelOnlyBorderBottom',
					])}
				>
					{label}
				</label>
				<textarea
					id={id}
					ref={ref}
					aria-label={label}
					rows={3 || rest.rows}
					className={classNames([
						className,
						typeStyleForms?.OnlyborderBottom ? 'inputFormBorderBottom' : 'inputFormLabelInside',
						sizeMap[typeStyleForms && typeStyleForms.OnlyborderBottom ? 'onlyborderBottom' : size],
					])}
					value={rest.value}
					onChange={rest.onChange}
					onBlur={rest.onBlur}
				/>
				{/* for error */}
				{validationMessage}
			</div>
		);
	},
);

export default TextAreaField;
