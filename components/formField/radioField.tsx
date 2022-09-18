import classNames from 'classnames';
import React from 'react';

import { RadioInputProps } from '@/components/formField/types';

export const RadioField = React.forwardRef(
	(
		{
			className,
			id,
			label,
			reverseRadio,
			render,
			styles,
			validationMessage,
			...rest
		}: RadioInputProps,
		ref: any,
	) => {
		return (
			<div
				className={classNames([
					reverseRadio ? 'flex-row-reverse w-full flex' : 'flex relative items-center',
					className,
				])}
				aria-live='polite'
			>
				<label htmlFor={id} className={classNames([styles?.label || 'labelRadio'])}>
					{render ? render : label}
				</label>
				<input
					autoComplete='off'
					ref={ref}
					id={id}
					type={'radio'}
					aria-label={label}
					className={classNames(['formRadio', styles?.input])}
					value={rest.value}
					onChange={() => rest.onChange}
					onBlur={rest.onBlur}
					{...rest}
				/>
				{!rest.hidden && (
					<>
						{/* for input radio */}
						<div className='checked-radio'></div>
						{/* apend error */}
						{validationMessage}
					</>
				)}
			</div>
		);
	},
);

export default RadioField;
