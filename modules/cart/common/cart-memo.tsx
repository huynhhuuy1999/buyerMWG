import { InputField, MessageErrors } from 'components';
import { ICartFormProps } from 'models';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const CartMemo: React.FC = () => {
	const {
		control,
		formState: { errors },
	} = useFormContext<ICartFormProps>();

	return (
		<div className='space-y-[10px]'>
			<div className='font-sfpro_bold text-16 font-semibold leading-6'>Yêu cầu khác</div>
			<Controller
				render={({ field }) => (
					<InputField
						{...field}
						id='otherRequirements'
						label=''
						size='medium'
						placeholder='Nhập mô tả yêu cầu'
						validationMessage={<MessageErrors name='otherRequirements' errors={errors} />}
						typeStyleForms={{ labelInsideBorder: true }}
					/>
				)}
				name='note'
				control={control}
			/>
		</div>
	);
};

export default CartMemo;
