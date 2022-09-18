import { Head } from 'components';
import Authentication from 'HOCs/Authentication';
import { LayoutProps } from 'models';
import dynamic from 'next/dynamic';
import React from 'react';
const Header = dynamic(() => import('../components/common/header'), {
	ssr: false,
}) as React.FC;

const DefaultLayoutWithAuth = ({
	children,
	title = process.env.NEXT_PUBLIC_DOMAIN_TITLE,
}: LayoutProps) => {
	return (
		<Authentication>
			<React.Fragment>
				<Head title={title}></Head>
				<div className='relative block'>
					<Header />
					<main>{children}</main>
				</div>
			</React.Fragment>
		</Authentication>
	);
};

export default DefaultLayoutWithAuth;
