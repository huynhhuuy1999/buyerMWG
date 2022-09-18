import { DeviceType } from 'enums';

export interface PositionMapProps {
	latlng: {
		lat: number;
		lng: number;
	};
	hasBeenChanged?: boolean;
	accuracy?: number;
	streetNumber: string;
	ids: {
		provinceId: number;
		districtId: number;
		wardId: number;
	};
	fullNameAddress: string;
}

export type MapStyles = 'default' | 'store';

export interface MapProps {
	onShow: (val: boolean) => void;
	deviceType?: DeviceType;
	onConfirm: (val: PositionMapProps) => void;
	mapContainerStyle?: React.CSSProperties;
	type?: MapStyles;
	defaultLatlng?: PositionMapProps['latlng'];
}
