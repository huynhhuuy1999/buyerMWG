import classNames from 'classnames';
import { useRef } from 'react';

import ImageCustom from '../ImageCustom';

interface IModalListProduct {
	isOpen: boolean;
	setIsOpen: (view: boolean) => void;
	message?: string;
}

const ModalListProduct: React.FC<IModalListProduct> = ({ isOpen, setIsOpen, message }) => {
	const ref = useRef<HTMLDivElement>(null);
	return (
		<div
			className={classNames([
				'bg-[#F1F1F1]/[0.3] fixed inset-0 h-full overflow-hidden w-full z-50 animation-300 ',
				isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
			])}
		>
			<div
				className={classNames(['alignCenterScreen__fixed animation-300 lg:w-auto w-[90%] z-[50]'])}
				ref={ref}
			>
				<div className={classNames(['bg-black bg-opacity-60 w-full mx-auto p-12 rounded-[3px]'])}>
					<div className='relative mx-auto mb-6 h-[78px] w-[78px]'>
						<ImageCustom
							src='/static/svg/failed-payment-icon.svg'
							alt='vuivui icon error'
							layout='fill'
							priority
						/>
					</div>
					<span className='block text-center font-sfpro_semiBold text-18 font-semibold leading-7 text-white'>
						{message}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ModalListProduct;
