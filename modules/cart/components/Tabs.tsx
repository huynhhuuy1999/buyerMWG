import { useAppDispatch } from 'hooks';
import { ICartFormProps } from 'models';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { addressActions, enumCartPickupAddress } from '@/store/reducers/address';

interface TabsProps {
	title: string;
	key: string;
	width?: number | string;
}

interface TabProps {
	tabs: TabsProps[];
	defaultActiveKey?: string;
	children?: ReactNode[];
}

const Tabs: React.FC<TabProps> = ({ tabs, defaultActiveKey, children }) => {
	const [activeTab, setActiveTab] = useState<string>(defaultActiveKey || tabs[0].key);
	const dispatch = useAppDispatch();
	const refValueAddress = useRef<any>();
	const { reset, getValues } = useFormContext<ICartFormProps>();

	useEffect(() => {
		if (activeTab === enumCartPickupAddress.homeDelivery) {
			refValueAddress.current = {
				address: getValues('address'),
				provinceId: getValues('provinceId'),
				districtId: getValues('districtId'),
				wardId: getValues('wardId'),
				receiveMyAddress: getValues('receiveMyAddress'),
			};
		} else {
			refValueAddress.current = {
				address: '',
				provinceId: getValues('provinceId'),
				districtId: getValues('districtId'),
				wardId: getValues('wardId'),
				pickupStoreId: getValues('pickupStoreId'),
				receiveMyAddress: getValues('receiveMyAddress'),
			};
		}
	}, [activeTab, getValues]);

	useEffect(() => {
		if (
			activeTab !== enumCartPickupAddress.homeDelivery &&
			Object.keys(refValueAddress.current)?.length
		) {
			if (refValueAddress?.current?.pickupStoreId) {
				reset(
					{
						...getValues(),
						provinceId: refValueAddress.current?.provinceId,
						districtId: refValueAddress.current?.districtId,
						wardId: refValueAddress.current?.wardId,
						pickupStoreId: refValueAddress.current?.pickupStoreId,
					},
					{ keepIsValid: Boolean(refValueAddress.current?.pickupStoreId) },
				);

				dispatch(
					addressActions.setProvince({
						id: Number(refValueAddress.current?.provinceId),
					}),
				);
				dispatch(
					addressActions.setDistrict({
						id: Number(refValueAddress.current?.districtId),
					}),
				);
				dispatch(
					addressActions.setWard({
						id: Number(refValueAddress.current?.wardId),
					}),
				);
				dispatch(addressActions.setActiveTypePickupAddress(activeTab));
			} else {
				dispatch(addressActions.reset());
				reset({
					...getValues(),
					address: '',
					provinceId: 0,
					districtId: 0,
					wardId: 0,
					pickupStoreId: '',
				});
				dispatch(addressActions.setActiveTypePickupAddress(activeTab));
			}
		} else if (
			!getValues('address') &&
			!getValues('provinceId') &&
			!getValues('districtId') &&
			!getValues('wardId') &&
			activeTab === enumCartPickupAddress.homeDelivery
		) {
			reset(
				{
					...getValues(),
					address: refValueAddress.current?.address,
					provinceId: refValueAddress.current?.provinceId,
					districtId: refValueAddress.current?.districtId,
					wardId: refValueAddress.current?.wardId,
				},
				{ keepIsValid: true },
			);

			dispatch(
				addressActions.setProvince({
					id: Number(refValueAddress.current?.provinceId),
				}),
			);
			dispatch(
				addressActions.setDistrict({
					id: Number(refValueAddress.current?.districtId),
				}),
			);
			dispatch(
				addressActions.setWard({
					id: Number(refValueAddress.current?.wardId),
				}),
			);
			dispatch(addressActions.setAddressDetails(refValueAddress.current?.address));
			dispatch(addressActions.setActiveTypePickupAddress(activeTab));
		} else {
			dispatch(addressActions.setActiveTypePickupAddress(activeTab));
		}
	}, [activeTab, dispatch]);

	return (
		<>
			<div className='flex border-b border-solid border-[#CFCFCF] text-center'>
				{tabs?.map((tab) => {
					return (
						<div
							key={tab.key}
							className={`flex justify-center border border-[#E0E0E0] transition-all duration-300${
								activeTab === tab.key ? 'border-b-2 border-b-[#F05A94]' : 'border-transparent'
							}`}
							style={{ flex: `0 0 ${tab.width}`, maxWidth: `${tab.width}` }}
							onClick={() => setActiveTab(tab.key)}
							onKeyPress={() => setActiveTab(tab.key)}
							tabIndex={0}
							role='button'
						>
							<div className='m-auto px-[14px]'>
								<span
									className={`font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] ${
										activeTab === tab.key ? 'text-[#F05A94]' : 'text-[#3E3E40]'
									}`}
								>
									{tab.title}
								</span>
							</div>
						</div>
					);
				})}
			</div>
			{children?.find((child: any) => {
				return child.key === activeTab;
			})}
		</>
	);
};

export default React.memo(Tabs);
