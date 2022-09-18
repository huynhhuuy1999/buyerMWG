import classNames from 'classnames';
import { InputField, MessageErrors } from 'components';
import { CustomerProfile, ICartFormProps, TypeActionShippingAddress } from 'models';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface CartInvoiceProps {
	control: any;
	onErrors?: {};
	isGetAddressInvoice: boolean | undefined;
	onGetAddressInvoice: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
interface CartInvoicePage {
	className?: string;
	profileActive?: CustomerProfile | null;
	typeAction: TypeActionShippingAddress;
}

const FormRegistInvoice: React.FC<CartInvoiceProps> = ({
	control,
	onErrors,
	onGetAddressInvoice,
	isGetAddressInvoice,
}) => {
	return (
		<div className='space-y-3 px-4 pb-4'>
			<Controller
				render={({ field }) => (
					<InputField
						{...field}
						id='companyName'
						type='text'
						label='Tên công ty'
						size='medium'
						typeStyleForms={{ OnlyborderBottom: true }}
						style={{ input: 'bg-white' }}
						required
						validationMessage={<MessageErrors name='companyName' errors={onErrors} />}
					/>
				)}
				name='companyName'
				control={control}
			/>

			<Controller
				render={({ field }) => (
					<InputField
						{...field}
						id='companyTaxCode'
						type='text'
						label='Mã số thuế'
						size='medium'
						typeStyleForms={{ OnlyborderBottom: true }}
						style={{ input: 'bg-white' }}
						required
						validationMessage={<MessageErrors name='companyTaxCode' errors={onErrors} />}
					/>
				)}
				name='companyTaxCode'
				control={control}
			/>

			<div className='flex items-center space-x-2 '>
				<input
					type='checkbox'
					checked={isGetAddressInvoice}
					className='box-border h-6 w-6 border border-solid border-black'
					onChange={() => onGetAddressInvoice(!isGetAddressInvoice)}
				/>
				<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-black'>
					Địa chỉ hóa hơn giống địa chỉ nhận hàng
				</span>
			</div>
			<Controller
				render={({ field }) => (
					<InputField
						{...field}
						id='companyAddress'
						type='text'
						size='medium'
						label='hoặc nhập địa chỉ hoá đơn'
						typeStyleForms={{ OnlyborderBottom: true }}
						style={{ input: 'bg-white' }}
						required
						validationMessage={<MessageErrors name='companyAddress' errors={onErrors} />}
					/>
				)}
				name='companyAddress'
				control={control}
			/>
		</div>
	);
};

const CartInvoice: React.FC<CartInvoicePage> = ({ className, typeAction, profileActive }) => {
	const [isActiveInvoice, setIsActiveInvoice] = useState<boolean>(false);
	const {
		control,
		resetField,
		formState: { errors },
	} = useFormContext<ICartFormProps>();
	const [isGetAddressInvoice, setIsGetAddessInvoice] = useState<boolean>();

	useEffect(() => {
		if (typeAction.action === 'EDIT') {
			setIsActiveInvoice(false);
			setIsGetAddessInvoice(false);
			resetField('companyAddress', { defaultValue: '' });
		}
		if (isGetAddressInvoice && isActiveInvoice) {
			resetField('companyAddress', {
				defaultValue: profileActive?.fullAddress
					?.split(', ')
					.filter((ele) => ele)
					.join(', '),
			});
		} else {
			resetField('companyAddress', { defaultValue: '' });
		}
	}, [isGetAddressInvoice, profileActive?.fullAddress, resetField, typeAction.action]);

	return (
		<div className={classNames(['bg-[#F2F2F2] rounded-[6px]', className])}>
			<div className='flex items-center space-x-2 p-4'>
				<Controller
					render={({ field }) => (
						<label className='form-checkbox'>
							<input
								onChange={(e) => {
									field.onChange(e.target.checked);
								}}
								type='checkbox'
								id={'isCompany'}
								checked={isActiveInvoice}
								// className='box-border h-6 w-6 border border-solid border-black'
								onClick={() => {
									setIsActiveInvoice(!isActiveInvoice);
									setIsGetAddessInvoice(!isGetAddressInvoice);
								}}
							/>
						</label>
					)}
					name='isCompany'
					control={control}
				/>

				<p className='font-sfpro text-16 leading-6 text-[#333333]'>Xuất hóa đơn công ty</p>
			</div>
			{isActiveInvoice ? (
				<FormRegistInvoice
					control={control}
					onErrors={errors}
					onGetAddressInvoice={setIsGetAddessInvoice}
					isGetAddressInvoice={isGetAddressInvoice}
				/>
			) : null}
		</div>
	);
};

export default React.memo(CartInvoice);
