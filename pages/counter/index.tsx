import { DeviceType } from 'enums';
import { DefaultLayout, DefaultLayoutMobile } from 'layouts';
import { NextPageWithLayout } from 'models';
import { Counter, CounterMobile } from 'modules';
import React from 'react';

const CounterPage: NextPageWithLayout = (pageProps: any) => {
	const { deviceType } = pageProps;
	CounterPage.Layout = deviceType === DeviceType.MOBILE ? DefaultLayoutMobile : DefaultLayout;

	return (
		<React.Fragment>
			<div>{deviceType === DeviceType.MOBILE ? <CounterMobile /> : <Counter />}</div>
		</React.Fragment>
	);
};

export default CounterPage;
