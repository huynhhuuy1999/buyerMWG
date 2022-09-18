import classNames from 'classnames';

interface ModalProps {
	children: React.ReactNode;
	className?: string;
	width?: string | number;
	height?: string | number;
}

const Modal: React.FC<ModalProps> = ({ children, className, height, width }) => {
	return (
		<div
			className={classNames([
				'bg-black bg-opacity-20 fixed top-0 left-0 right-0 bottom-0 h-full overflow-hidden w-full z-50',
			])}
		>
			<div
				className={classNames([
					'alignCenterScreen__fixed animation-300 rounded-lg w-[90%] z-[50] shadow-xl',
					'opacity-100 visible',
					width ?? 'lg:w-auto',
					height,
				])}
			>
				<div
					className={classNames([
						'bg-[#FFFFFF] w-full mx-auto px-12 py-6 rounded-lg text-[#272728]',
						className,
					])}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
