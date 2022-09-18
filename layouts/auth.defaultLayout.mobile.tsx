import Authentication from 'HOCs/Authentication';
import { LayoutProps } from 'models';
import React from 'react';

const DefaultLayoutMobileWithAuth = ({ children }: LayoutProps) => {
	return (
		<Authentication>
			<React.Fragment>
				<main>{children}</main>
			</React.Fragment>
		</Authentication>
	);
};

export default DefaultLayoutMobileWithAuth;
