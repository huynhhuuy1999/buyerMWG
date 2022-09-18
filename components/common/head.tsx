import { seoConfig } from 'configs';
import NextHead from 'next/head';
import { DefaultSeo } from 'next-seo';
import React, { FC } from 'react';

interface IHeadProps {
	title?: string;
}

const Head: FC<IHeadProps> = ({ title }) => {
	return (
		<>
			<DefaultSeo {...seoConfig} />
			<NextHead>
				<meta charSet='UTF-8' />
				<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
				<meta name='mobile-web-app-capable' content='yes' />
				{/* <meta name='apple-mobile-web-app-title' content='vuivui.com' />
				<meta name='apple-mobile-web-app-status-bar-style' />
				<meta name='apple-mobile-web-app-capable' content='yes' /> */}
				<link rel='shortcut icon' href='/favicon.ico' />
				{/* <meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
				/> */}
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
				/>
				<title>{title || 'VuiVui.com'}</title>
			</NextHead>
		</>
	);
};

export default Head;
