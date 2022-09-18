import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { Conversation } from 'models';
import { Feedback } from 'modules';
import React, { useRef } from 'react';

interface ContactSupportProps {
	width?: string;
	height?: string;
	bottom?: string;
	right?: string;
	zIndex?: number;
	listChat?: Conversation[];
	handleRoomChat?: Function;
}

const ContactSupport: React.FC<ContactSupportProps> = ({
	width,
	height,
	bottom,
	right,
	zIndex,
	listChat,
	handleRoomChat,
}) => {
	const buttonRef = useRef<HTMLDivElement>(null);
	global?.window?.addEventListener('scroll', () => {
		if (global?.window?.scrollY > 400) {
			buttonRef.current?.classList.add(`${bottom || 'bottom-28'}`);
			buttonRef.current?.classList.remove('bottom-16');
		} else {
			buttonRef.current?.classList.add('bottom-16');
			buttonRef.current?.classList.remove(`${bottom || 'bottom-28'}`);
		}
	});

	return (
		<div
			ref={buttonRef}
			style={{ right: `${right && right}`, zIndex: `${zIndex && zIndex}` }}
			className='fixed right-7 bottom-16 z-[5] py-2 hover:opacity-100'
			role='button'
		>
			<div>
				{listChat &&
					listChat.length > 0 &&
					listChat.map((item, index) => {
						return (
							<div className='relative' key={index}>
								<ImageCustom
									loading='lazy'
									className='cursor-pointer hover:opacity-90 rounded-full object-cover transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none'
									src={item.avatar && REGEX_IMAGE.test(item.avatar) ? item.avatar : EmptyImage}
									width={50}
									height={50}
									role='button'
									tabIndex={0}
									onClick={() => handleRoomChat?.(item, 1)}
									onKeyPress={() => handleRoomChat?.(item, 1)}
									alt={item.name ? item.name : 'unknown'}
									title={item.name ? item.name : 'unknown'}
								/>
								<span
									className='absolute right-0 top-0 z-20 rounded-full'
									tabIndex={0}
									role='button'
									onKeyPress={() => handleRoomChat?.(item, 2)}
									onClick={() => handleRoomChat?.(item, 2)}
								>
									<ImageCustom
										priority
										className='w-3'
										width={16}
										height={16}
										src={'/static/svg/closeCircle.svg'}
									/>
								</span>
								<span className='absolute left-2 bottom-1 z-10 h-3 w-3 rounded-full bg-green-600'></span>
							</div>
						);
					})}
			</div>

			<Feedback />
		</div>
	);
};

export default ContactSupport;
