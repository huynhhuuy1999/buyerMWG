import { ImageCustom, MessageErrors, SelectField } from 'components';
import { useAppSelector } from 'hooks';
import { CartModel, GenderEnums, ICartFormProps, pickupStoreModels } from 'models';
import { Controller, useFormContext } from 'react-hook-form';
import { AppDispatch } from 'store';

import { useAppSWR } from '@/hooks/useAppSWR';
import { Address, addressActions, addressSelector } from '@/store/reducers/address';

import { ChooseStore } from '../../components';

interface CartPickupInStore {
	dataAddress: Address;
	dataCart?: CartModel | null;
	onChange: AppDispatch;
}

const CartPickupAddress: React.FC<CartPickupInStore> = ({ dataAddress, dataCart, onChange }) => {
	const {
		control,
		formState: { errors },
		getValues,
		resetField,
	} = useFormContext<ICartFormProps>();

	const addessState = useAppSelector(addressSelector);

	const { data: dataPickupStore } = useAppSWR<pickupStoreModels[]>(
		addessState?.ids?.province && addessState?.ids?.district && addessState?.ids?.ward
			? {
					url: `/pickupstore/byaddress/${addessState?.ids?.province}/${addessState?.ids?.district}/${addessState?.ids?.ward}`,
					method: 'GET',
			  }
			: null,
	);

	return (
		<div className='space-y-5'>
			<div className='flex items-center space-x-2'>
				<div className='relative aspect-square h-full w-8 cursor-pointer'>
					<ImageCustom layout='fill' alt='location' src='/static/svg/location-7953d2.svg' />
				</div>
				<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#f05a94]'>
					Siêu thị gần nhất vị trí hiện tại của{' '}
					{dataCart?.cartShipping?.gender === GenderEnums.Male ? 'Anh' : 'Chị'}{' '}
					{dataCart?.cartShipping?.contactName}
				</span>
			</div>
			<Controller
				render={({ field }) => (
					<SelectField
						id='provinceId'
						label='Tỉnh / Thành phố'
						{...field}
						typeStyleForms={{ labelInsideBorder: true }}
						suffixIcon={<span></span>}
						onChange={(e) => {
							field.onChange(e);
							onChange(
								addressActions.setProvince({
									id: Number(e.target.value),
									name: e.target.selectedOptions?.[0]?.label,
								}),
							);
							resetField('districtId', { keepDirty: false, defaultValue: 0 });
							resetField('wardId', { keepDirty: false, defaultValue: 0 });
						}}
						validationMessage={<MessageErrors name='provinceId' errors={errors} />}
						options={dataAddress.data?.provinceTree.map((item) => {
							return { name: item.provinceName, value: item.provinceId };
						})}
					/>
				)}
				name='provinceId'
				control={control}
			/>

			<div className='grid grid-cols-2 gap-x-2'>
				<Controller
					render={({ field }) => (
						<SelectField
							{...field}
							id='districtId'
							label='Quận / Huyện'
							typeStyleForms={{ labelInsideBorder: true }}
							suffixIcon={<span></span>}
							onChange={(e) => {
								field.onChange(e);
								onChange(
									addressActions.setDistrict({
										id: Number(e.target.value),
										name: e.target.selectedOptions?.[0]?.label,
									}),
								);
								resetField('wardId', { keepDirty: false, defaultValue: 0 });
							}}
							validationMessage={<MessageErrors name='districtId' errors={errors} />}
							options={(dataAddress.data?.district || []).map((item: any) => {
								return { name: item.districtName, value: item.districtId };
							})}
						/>
					)}
					name='districtId'
					control={control}
				/>
				<Controller
					render={({ field }) => (
						<SelectField
							{...field}
							id='wardId'
							label='Phường / Xã'
							typeStyleForms={{ labelInsideBorder: true }}
							suffixIcon={<span></span>}
							onChange={(e) => {
								field.onChange(e);
								onChange(
									addressActions.setWard({
										id: Number(e.target.value),
										name: e.target.selectedOptions?.[0]?.label,
									}),
								);
								resetField('pickupStoreId', { keepDirty: false, defaultValue: 0 });
							}}
							validationMessage={<MessageErrors name='wardId' errors={errors} />}
							options={(dataAddress.data?.ward || []).map((item: any) => {
								return { name: item.wardName, value: item.wardId };
							})}
						/>
					)}
					name='wardId'
					control={control}
				/>
			</div>
			<div>
				<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-black'>
					Chọn nơi nhận hàng
				</span>
				<ChooseStore stores={dataPickupStore} defaultValue={getValues('pickupStoreId')} />
			</div>
		</div>
	);
};

export default CartPickupAddress;
