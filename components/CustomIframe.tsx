import React from 'react';

interface CustomIframeProps {
	children?: React.ReactNode;
	title: string;
	src: string;
}

const CustomIframe: React.FC<CustomIframeProps> = ({ src, children, title, ...props }) => {
	return (
		<iframe
			{...props}
			src={src}
			title={title}
			width={'100%'}
			height={'100%'}
			className={'iframe-vuivui'}
		/>
	);
};

export default CustomIframe;
