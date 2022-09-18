import { ImageCustom, InputField, MessageErrors, SelectField } from 'components';
import { useAppSelector, useAppSWR } from 'hooks';
import { CartModel, GenderEnums, ICartFormProps, pickupStoreModels } from 'models';
import { Controller, useFormContext } from 'react-hook-form';
import { AppDispatch } from 'store';

import { Address, addressActions, addressSelector } from '@/store/reducers/address';

import { ChooseStore } from '../../components';

interface CartPickupInStore {
	dataAddress: Address;
	dataCart?: CartModel | null;
	onChange: AppDispatch;
	renderBtnSubmit?: React.ReactNode;
}
const CartPickupAddressMobile: React.FC<CartPickupInStore> = ({
	dataAddress,
	dataCart,
	onChange,
	renderBtnSubmit,
}) => {
	const {
		control,
		getValues,
		formState: { errors },
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
		<div className='pb-4'>
			<div className='relative px-4 pb-4'>
				<div className='flex items-center justify-center space-x-2 rounded-[3px] bg-[#126BFB] py-2.5 px-5 text-white'>
					<div className='relative aspect-square h-full w-5 cursor-pointer'>
						<ImageCustom layout='fill' alt='location' src='/static/svg/GPS.svg' />
					</div>
					<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px]'>
						Siêu thị gần nhất vị trí hiện tại của{' '}
						{dataCart?.cartShipping?.gender === GenderEnums.Male ? 'Anh' : 'Chị'}{' '}
						{dataCart?.cartShipping?.contactName}
					</span>
				</div>
				<p className='pt-4 pb-2 text-14 text-[#999999]'>Hoặc tìm siêu thị theo</p>
				<div className='space-y-5'>
					<div className='flex gap-2'>
						<InputField
							id='searchAddress'
							type='text'
							label='Tìm siêu thị'
							size='medium'
							typeStyleForms={{ labelInsideBorder: true, animation: true }}
							style={{ input: 'bg-white' }}
							suffixIcon={<img src='/static/svg/search-store-icon.svg' alt='' />}
						/>

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
									className={'flex-auto'}
									validationMessage={<MessageErrors name='provinceId' errors={errors} />}
									options={(dataAddress.data?.provinceTree || [])?.map((item) => {
										return { name: item.provinceName, value: item.provinceId };
									})}
								/>
							)}
							name='provinceId'
							control={control}
						/>
					</div>

					{getValues('provinceId') ? (
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
									options={(dataAddress.data?.district || []).map((item) => {
										return { name: item.districtName, value: item.districtId };
									})}
								/>
							)}
							name='districtId'
							control={control}
						/>
					) : null}

					{getValues('districtId') && getValues('provinceId') ? (
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
									options={(dataAddress.data?.ward || []).map((item) => {
										return { name: item.wardName, value: item.wardId };
									})}
								/>
							)}
							name='wardId'
							control={control}
						/>
					) : null}
				</div>
			</div>
			<span className='block bg-[#F1F1F1] px-2.5 py-2 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-black'>
				Chọn nơi nhận hàng
			</span>
			<div className='px-4'>
				<ChooseStore stores={dataPickupStore} defaultValue={getValues('pickupStoreId')} />
			</div>
			<div className='bottom-0 z-[5] px-4' style={{ position: 'sticky' }}>
				{renderBtnSubmit}
			</div>
		</div>
	);
};

export default CartPickupAddressMobile;
