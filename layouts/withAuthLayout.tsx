import { Footer, Head, Header, ImageCustom } from 'components';
import { LayoutProps } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface TabsProps {
	path: string;
	expression?: any;
}

const Sidebar = dynamic(() => import('@/components/Sidebar')) as React.FC<TabsProps>;

const WithAuthLayout = (props: LayoutProps) => {
	const { title = process.env.NEXT_PUBLIC_DOMAIN_TITLE } = props;
	const router = useRouter();
	const [path, setPath] = useState<string>('');
	useEffect(() => {
		if (router.asPath && router.asPath !== path) {
			setPath(router.asPath);
		}
	}, [router]);
	return (
		<React.Fragment>
			<Head title={title}></Head>
			<Header />
			<div className='bg-E5E5E5 '>
				<div className='container relative pt-4 pb-12' style={{ minHeight: 'calc(100vh - 91px)' }}>
					<div className='grid grid-cols-4'>
						<div style={{ minWidth: 862 }} className='col-span-3'>
							{props.children}
						</div>
						<div className='col-span-1 flex justify-end'>
							<Sidebar path={path} />
						</div>
					</div>
					<div className='fixed bottom-4 right-[16px] h-[84px] w-[84px] -translate-x-4 -translate-y-4'>
						<ImageCustom src='/static/images/support.png' alt='vuivui Suport' layout='fill' />
					</div>
				</div>
			</div>
			<Footer />
		</React.Fragment>
	);
};

export default WithAuthLayout;
