import {
	GoogleMap,
	InfoBox,
	Marker,
	StandaloneSearchBox,
	useJsApiLoader,
} from '@react-google-maps/api';
import classNames from 'classnames';
import { ImageCustom, Notification } from 'components';
import { DeviceType, TYPE_ADDRESS_GOOGLE } from 'enums';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDistrictApi, getProvincesApi, getWardApi } from 'services';
import { getAddressFromLocationGoogleMap } from 'utils';

import { MapProps, PositionMapProps } from './types';

const Map: React.FC<MapProps> = ({
	mapContainerStyle,
	onShow,
	onConfirm,
	deviceType = DeviceType.DESKTOP,
	defaultLatlng,
	type = 'default',
}) => {
	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
	});
	const geocoder = new google.maps.Geocoder();

	const [map, setMap] = React.useState<any>(null);
	const [isShowAddress, setIsShowAddress] = useState<boolean>(false);
	const [position, setPostion] = useState<PositionMapProps>({
		ids: { districtId: 0, provinceId: 0, wardId: 0 },
		latlng: { lat: 0, lng: 0 },
		streetNumber: '',
		accuracy: 0,
		hasBeenChanged: false,
		fullNameAddress: '',
	});

	const accuracyCircle = useRef<any>(null);
	const searchBoxRef = useRef<any>(null);

	useEffect(() => {
		if (!position?.latlng?.lat && !position?.latlng?.lng && defaultLatlng) {
			handleOnChangeAddress({ lat: defaultLatlng?.lat!, lng: defaultLatlng?.lng! });
		}
	}, [defaultLatlng]);

	useEffect(() => {
		isLoaded && getCurrentPositionUser();
		if (loadError) {
			Notification.Info.default(
				'Có lỗi xảy ra trong quá trình tìm vị trí, xin vui lòng thử lại !!',
				'ERROR',
				3000,
			);
		}
	}, [isLoaded, loadError, map]);

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
						}
					}
				})
				.catch((e: any) => {});
		},
		[geocoder],
	);

	const getCurrentPositionUser = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude, accuracy } = position?.coords;
			handleOnChangeAddress({ lat: latitude, lng: longitude }, accuracy);
		});
	};

	const onLoad = React.useCallback(
		function callback(map) {
			accuracyCircle.current = new google.maps.Circle({
				center: { lat: position.latlng?.lat, lng: position.latlng?.lng },
				fillColor: '#61a0bf',
				fillOpacity: 0.4,
				radius: 10,
				strokeColor: '#1bb6ff',
				strokeOpacity: 0.4,
				strokeWeight: 1,
				zIndex: 1,
			});
			map.setCenter(new google.maps.LatLng(position.latlng?.lat, position.latlng?.lng));
			map.setZoom(18);
			accuracyCircle.current.setMap(map);
			setMap(map);
		},
		[position],
	);

	const onUnmount = React.useCallback(function callback(map) {
		setMap(null);
	}, []);

	const onPlaceChanged = () => {
		const arrayDiscriptionDetailPlaces = searchBoxRef.current.state.searchBox?.getPlaces();

		geocoder
			.geocode({ placeId: arrayDiscriptionDetailPlaces?.[0]?.place_id })
			.then(async (response: { results?: Array<any> }) => {
				if (response.results?.length) {
					const locationPlaces = response?.results?.[0]?.geometry;
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
							latlng: {
								lat: locationPlaces?.location?.lat(),
								lng: locationPlaces?.location?.lng(),
							},
							streetNumber: address?.street_number,
							ids: {
								districtId: district?.[0]?.districtId,
								provinceId: province?.[0]?.provinceId,
								wardId: wardId?.[0]?.wardId,
							},
							fullNameAddress: Object.values(address)?.reverse()?.join(', '),
						}));
					}
				}
			})
			.catch((e: any) => {});
	};

	return isLoaded && position.latlng?.lat && position.latlng?.lng ? (
		<div
			className={classNames([
				'alignCenterScreen__fixed z-[50] h-full w-full overflow-hidden bg-black bg-opacity-40',
				deviceType === DeviceType.MOBILE ? 'p-0' : 'p-6',
			])}
		>
			<button
				className='absolute right-[6px] top-[6px] z-[60] overflow-hidden rounded-full bg-[#ededed] p-2 shadow-xl'
				onClick={() => onShow(false)}
			>
				<div className='relative h-[20px] w-[20px]'>
					<ImageCustom layout='fill' src={'/static/svg/Close.svg'} />
				</div>
			</button>
			<GoogleMap
				mapContainerStyle={
					mapContainerStyle ?? {
						width: '100%',
						height: 'calc(100vh - 48px)',
						zIndex: '50',
					}
				}
				center={position.latlng}
				onLoad={onLoad}
				options={{
					streetViewControl: false,
					fullscreenControl: deviceType !== DeviceType.MOBILE,
					mapTypeControl: deviceType !== DeviceType.MOBILE,
					zoomControl: false,
				}}
				onUnmount={onUnmount}
			>
				<Marker
					position={position.latlng}
					animation={google.maps.Animation.DROP}
					draggable
					onClick={() => setIsShowAddress(!isShowAddress)}
					onDragEnd={({ latLng }) =>
						handleOnChangeAddress({ lat: latLng?.lat()!, lng: latLng?.lng()! })
					}
				>
					<StandaloneSearchBox ref={searchBoxRef} onPlacesChanged={onPlaceChanged}>
						<input
							type='text'
							placeholder='Tìm kiếm'
							style={{
								boxSizing: `border-box`,
								border: `1px solid transparent`,
								width: deviceType === DeviceType.MOBILE ? `calc(100% - 12px)` : `30%`,
								margin: '10px auto 0 auto',
								height: `32px`,
								padding: `20px 12px`,
								borderRadius: `6px`,
								color: '#333333',
								boxShadow: `0px 0.1px 0.3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.2)`,
								fontSize: `14px`,
								outline: `none`,
								textOverflow: `ellipses`,
								position: 'absolute',
								left: ' 50%',
								transform: 'translateX(-50%)',
							}}
						/>
					</StandaloneSearchBox>
					{isShowAddress ? (
						<InfoBox
							options={{
								closeBoxURL: '',
								enableEventPropagation: true,
								boxStyle: { width: deviceType === DeviceType.MOBILE ? '50%' : '250px' },
							}}
						>
							<div className='w-full text-14 font-bold text-[#EA001B]'>
								{position?.fullNameAddress}
							</div>
						</InfoBox>
					) : null}
				</Marker>

				<button
					className={classNames([
						'left-[50%] z-[70] -translate-x-[50%] rounded-[6px] bg-pink-F05A94 p-3 text-14 text-white',
						deviceType === DeviceType.MOBILE
							? `w-[calc(100%_-_12px)] fixed bottom-4`
							: `w-[30%] absolute bottom-[54px]`,
					])}
					onClick={() => {
						onShow(false);
						onConfirm(position);
					}}
				>
					Lưu
				</button>
			</GoogleMap>
		</div>
	) : null;
};

export default React.memo(Map);
