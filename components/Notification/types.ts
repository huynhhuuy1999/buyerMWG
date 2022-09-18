import { DeviceType } from 'enums/';

export type StatusType = 'SUCCESS' | 'ERROR' | 'PENDING' | 'WARNING' | 'INFO';

export interface InfoNotificationsProps {
	titleHeade?: string;
	message: any;
	deviceType?: DeviceType;
	status: StatusType;
	className?: string;
	timeout?: number; //default 3s
	isOpen?: boolean;
	icon?: string;
	closeIcon?: boolean;
}

export interface ComingNotificationsProps {
	titleHeade?: string;
	message: any;
	className?: string;
	timeout?: number; //default 3s
	isOpen?: boolean;
	icon?: string;
	closeIcon?: boolean;
	onClick?: () => {};
}

export interface ConfirmNotificationProps {
	titleHead: string;
	message: string;
	contextConfirm: string;
	contextNotConfirm: string;
	onConfirm: () => {};
	onNotConfirm: () => {};
}
