import { Footer, Head, Header } from 'components';
import { LayoutProps } from 'models';
import React from 'react';

const HomeLayout = ({ children, title = process.env.NEXT_PUBLIC_DOMAIN_TITLE }: LayoutProps) => {
	return (
		<React.Fragment>
			<Head title={title}></Head>
			<div className='relative block'>
				<Header />
				<main>{children}</main>
				<Footer />
			</div>
		</React.Fragment>
	);
};

export default HomeLayout;
