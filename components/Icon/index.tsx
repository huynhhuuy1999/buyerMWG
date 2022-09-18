import classNames from 'classnames';

import { IconEnum, IconType } from './icon-enum';
export interface IconProps {
	type: IconEnum;
	variant?: IconType;
	size?: number;
	className?: string;
	onClick?: () => void;
	onKeyPress?: () => void;
}

const DEFAULT_SIZE = 32;

const Icon = (props: IconProps) => {
	const { type, size = 32, className, variant = 'dark', onClick, onKeyPress } = props;

	const selectVariant = (variant: IconType) => {
		switch (variant) {
			case 'light':
				return 'icon-vv-light';
			case 'dark':
				return 'icon-vv-dark';
			case 'primary':
				return 'icon-vv-primary';
			case 'secondary':
				return 'icon-vv-secondary';
			case 'semi-secondary':
				return 'icon-vv-semi-secondary';
			case 'gray':
				return 'icon-vv-gray';
			case 'semi-dark':
				return 'icon-vv-semi-dark';
			default:
				return 'icon-vv-dark';
		}
	};

	return (
		<div
			role='button'
			style={{
				width: size,
				height: size,
				marginTop: `-${size / 2}px`,
				marginLeft: `-${size / 2}px`,
			}}
			className='focus:outline-none focus-visible:outline-none'
			onClick={() => onClick && onClick()}
			onKeyPress={() => onKeyPress && onKeyPress()}
			tabIndex={-1}
		>
			<div
				className={classNames(
					selectVariant(variant),
					type,
					className,
					'focus:outline-none focus-visible:outline-none',
				)}
				style={{ transform: `scale(${size / DEFAULT_SIZE})` }}
			/>
		</div>
	);
};

export default Icon;
