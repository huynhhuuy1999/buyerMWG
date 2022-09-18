// import { Head } from 'components';
import { LayoutProps } from 'models';
import dynamic from 'next/dynamic';
import React from 'react';

const Header = dynamic(() => import('../components/common/header'), {
	ssr: false,
}) as React.FC<any>;
const Footer = dynamic(() => import('../components/common/footer')) as React.FC<any>;

const DefaultLayout = ({ children }: LayoutProps) => {
	return (
		<React.Fragment>
			{/* <Head title={title}></Head> */}
			<div className='relative block' style={{ minHeight: '100vh' }}>
				<Header />
				<div className='pb-10'>
					<main>{children}</main>
				</div>
				<div className='absolute bottom-0 mt-10 w-full'>
					<Footer />
				</div>
			</div>
		</React.Fragment>
	);
};

export default DefaultLayout;
