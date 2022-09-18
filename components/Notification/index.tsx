import ReactDOM from 'react-dom';

import { ComingNotification } from './Coming';
import { ConfirmNotification } from './Confirm';
import { InfoNotifications } from './Info';
import { LoadingCustom, LoadingDefault } from './Loading';
import { ComingNotificationsProps, StatusType } from './types';

const Notification = {
	Loading: {
		custom: () => {
			ReactDOM.render(<LoadingCustom />, document.getElementById('vuivui-portal'));
		},
		default: () => {
			ReactDOM.render(<LoadingDefault />, document.getElementById('vuivui-portal'));
		},
		remove: (delays?: number) => {
			const ele = document.getElementById('notification-vuivui');
			setTimeout(() => {
				ele?.classList.add('opacity-keyframes');
				ReactDOM.render(<span></span>, document.getElementById('vuivui-portal'));
			}, delays);
		},
	},
	Info: {
		default: (message: string, status: StatusType, timeout: number) => {
			ReactDOM.render(
				<InfoNotifications message={message} status={status} isOpen timeout={timeout} />,
				document.getElementById('vuivui-portal'),
			);
		},
		remove: (delays?: number) => {
			const ele = document.getElementById('infoNotification-vuivui');
			setTimeout(() => {
				ele?.classList.add('opacity-keyframes');
				ReactDOM.render(<span></span>, document.getElementById('vuivui-portal'));
			}, delays);
		},
	},
	Confirm: {
		show: (
			titleHead: string,
			message: string,
			contextConfirm: string,
			contextNotConfirm: string,
			onConfirm: () => {},
			onNotConfirm: () => {},
		) => {
			ReactDOM.render(
				<ConfirmNotification
					message={message}
					titleHead={titleHead}
					contextConfirm={contextConfirm}
					contextNotConfirm={contextNotConfirm}
					onConfirm={onConfirm}
					onNotConfirm={onNotConfirm}
				/>,
				document.getElementById('vuivui-portal'),
			);
		},
		remove: () => {
			const ele = document.getElementById('confirmNotification-vuivui');
			ele?.classList.add('opacity-keyframes');
			ReactDOM.render(<span></span>, document.getElementById('vuivui-portal'));
		},
	},
	Coming: {
		show: (notification: ComingNotificationsProps) => {
			ReactDOM.render(
				<ComingNotification
					message={notification.message}
					isOpen={notification.isOpen}
					icon={notification.icon}
					closeIcon={notification.closeIcon}
					onClick={notification.onClick}
					timeout={notification.timeout}
					titleHeade={notification.titleHeade}
					className={notification.className}
				/>,
				document.getElementById('vuivui-portal'),
			);
		},
		remove: (delays?: number) => {
			const ele = document.getElementById('comingNotification-vuivui');
			setTimeout(() => {
				ele?.classList.add('opacity-keyframes');
				ReactDOM.render(<span></span>, document.getElementById('vuivui-portal'));
			}, delays);
		},
	},
};
export default Notification;
