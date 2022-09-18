// import { Head } from 'components';
import { HeaderMobile } from 'components';
import { LayoutProps } from 'models';
import React from 'react';

const DefaultLayoutMobile = ({ children }: LayoutProps) => (
	<React.Fragment>
		<HeaderMobile />
		<main>{children}</main>
	</React.Fragment>
);

export default DefaultLayoutMobile;
