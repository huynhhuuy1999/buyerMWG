import React from 'react';
interface ISpinProps {
	isColor?: string;
	spinning?: boolean;
	className?: string;
	prefixCls?: string;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large' | number;
	tip?: React.ReactNode;
	delay?: number;
	minDuration?: number;
	wrapperClassName?: string;
	indicator?: React.ReactNode;
}
const Spin: React.FC<ISpinProps> = ({
	spinning,
	className,
	prefixCls,
	style,
	size,
	tip,
	wrapperClassName,
	indicator,
	children,
	isColor,
}) => {
	const handleSpinning = () => {
		const checkType = spinning != undefined;
		if (checkType) {
			spinning = spinning;
		} else {
			spinning = true;
		}
	};
	handleSpinning();
	return (
		<div className={`relative h-full w-full ${className || ''}`} style={style}>
			{spinning && (
				<div className='z-10 grid h-full w-full justify-center'>
					<div className='static grid justify-center'>
						<span className={`inline-block animate-spin`}>
							{indicator ? (
								indicator
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 4335 4335'
									width={size ? size : 24}
									height={size ? size : 24}
								>
									<path
										fill={`${isColor ? isColor : '#F05A94'}`}
										d='M3346 1077c41,0 75,34 75,75 0,41 -34,75 -75,75 -41,0 -75,-34 -75,-75 0,-41 34,-75 75,-75zm-1198 -824c193,0 349,156 349,349 0,193 -156,349 -349,349 -193,0 -349,-156 -349,-349 0,-193 156,-349 349,-349zm-1116 546c151,0 274,123 274,274 0,151 -123,274 -274,274 -151,0 -274,-123 -274,-274 0,-151 123,-274 274,-274zm-500 1189c134,0 243,109 243,243 0,134 -109,243 -243,243 -134,0 -243,-109 -243,-243 0,-134 109,-243 243,-243zm500 1223c121,0 218,98 218,218 0,121 -98,218 -218,218 -121,0 -218,-98 -218,-218 0,-121 98,-218 218,-218zm1116 434c110,0 200,89 200,200 0,110 -89,200 -200,200 -110,0 -200,-89 -200,-200 0,-110 89,-200 200,-200zm1145 -434c81,0 147,66 147,147 0,81 -66,147 -147,147 -81,0 -147,-66 -147,-147 0,-81 66,-147 147,-147zm459 -1098c65,0 119,53 119,119 0,65 -53,119 -119,119 -65,0 -119,-53 -119,-119 0,-65 53,-119 119,-119z'
									/>
								</svg>
							)}
						</span>
					</div>
					{tip && (
						<div className='animate-pulse text-blue-600'>
							<div className={prefixCls && prefixCls}>{tip}</div>
						</div>
					)}
				</div>
			)}
			<div
				className={`${
					spinning ? 'pointer-events-none relative clear-both select-none opacity-50' : ''
				} ${wrapperClassName && wrapperClassName}`}
			>
				{children && children}
			</div>
		</div>
	);
};

export default Spin;
