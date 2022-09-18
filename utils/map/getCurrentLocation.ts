import { TYPE_ADDRESS_GOOGLE } from 'enums';
import React, { useCallback, useEffect, useState } from 'react';
import { getDistrictApi, getProvincesApi, getWardApi } from 'services';

import { PositionMapProps } from '@/components/GoogleMap/types';

export const getAddressFromLocationGoogleMap = (listResGoogle: any) => {
	const { PROVINCE, DISTRICT, WARD, NUM_STREET, NAME_STREET } = TYPE_ADDRESS_GOOGLE;

	let ADDRESS_DETAILS = [PROVINCE, DISTRICT, WARD, NUM_STREET, NAME_STREET];

	let address = {
		[PROVINCE]: '',
		[DISTRICT]: '',
		[WARD]: '',
		[NUM_STREET]: '',
		[NAME_STREET]: '',
	};

	if (listResGoogle.length > 0) {
		listResGoogle.forEach((item: any) => {
			item.address_components.forEach((component: any) => {
				if (!ADDRESS_DETAILS.length) {
					return;
				}

				if (ADDRESS_DETAILS.includes(component.types[0])) {
					address = {
						...address,
						[component.types[0]]: component.long_name,
					};

					const keyIndex = ADDRESS_DETAILS.indexOf(component.types[0]);
					ADDRESS_DETAILS.splice(keyIndex, 1);
				}
			});
		});
	}
	return address;
};

export const useLocationUser = () => {
	const geocoder = new google.maps.Geocoder();
	const [mount, setMount] = React.useState<any>(null);
	const [position, setPostion] = useState<PositionMapProps>({
		ids: { districtId: 0, provinceId: 0, wardId: 0 },
		latlng: { lat: 0, lng: 0 },
		streetNumber: '',
		accuracy: 0,
		hasBeenChanged: false,
		fullNameAddress: '',
	});

	const handleOnChangeAddress = useCallback(
		(latlng: PositionMapProps['latlng'], accuracy?: number) => {
			geocoder
				.geocode({ location: latlng })
				.then(async (response: { results?: Array<any> }) => {
					if (response.results?.length) {
						let address = getAddressFromLocationGoogleMap(response.results);
						if (address) {
							const { data: province } = await getProvincesApi({
								q: address[TYPE_ADDRESS_GOOGLE.PROVINCE],
							});
							const { data: district } = await getDistrictApi({
								province_id: province?.[0]?.provinceId,
								q: address[TYPE_ADDRESS_GOOGLE.DISTRICT],
							});
							const { data: wardId } = await getWardApi({
								province_id: province?.[0]?.provinceId,
								q: address[TYPE_ADDRESS_GOOGLE.WARD],
								district_id: district?.[0]?.districtId,
							});

							setPostion((prev) => ({
								...prev,
								latlng: latlng,
								streetNumber: [address?.street_number, address?.route].join(', '),
								ids: {
									provinceId: province?.[0]?.provinceId,
									districtId: district?.[0]?.districtId,
									wardId: wardId?.[0]?.wardId,
								},
								hasBeenChanged: true,
								accuracy,
								fullNameAddress: [address]
									.map((ele) => {
										return [
											address.street_number,
											address.route,
											address.administrative_area_level_3,
											address.administrative_area_level_2,
											address.administrative_area_level_1,
										];
									})
									.join(', '),
							}));
							setMount(true);
						}
					}
				})
				.catch((e: any) => {});
		},
		[geocoder],
	);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude, accuracy } = position?.coords;
			handleOnChangeAddress({ lat: latitude, lng: longitude }, accuracy);
		});
	}, [mount]);

	return { position };
};
