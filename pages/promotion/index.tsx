import { Head } from 'components';
import { NextPageWithLayout } from 'models';
import React from 'react';

const HomePage: NextPageWithLayout = ({ title = 'Khuyến mãi' }: any) => {
	// const { deviceType } = pageProps;
	const dangerouslySetInnerHTML = '123';
	return (
		<React.Fragment>
			<Head title={title} />
			<>Khuyến mãi</>
			<>
				Chương trình khuyến mãi {title}
				<div id='vuivui_page_builder'>{dangerouslySetInnerHTML}</div>
			</>
		</React.Fragment>
	);
};

export default HomePage;
