import Document, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';
import Script from 'next/script';
import * as React from 'react';

// @ts-ignore
import outputcss from '!raw-loader!../styles/output.css';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;
export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const originalRenderPage = ctx.renderPage;

		originalRenderPage({
			enhanceApp: (App: any) => (props) => <App {...props} />,
		});

		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			// styles: [...React.Children.toArray(initialProps.styles)],
			styles: (
				<>
					{process.env.NODE_ENV === 'production' ? (
						<>
							{initialProps.styles}
							<style
								dangerouslySetInnerHTML={{
									__html: outputcss,
								}}
							/>
						</>
					) : (
						[...React.Children.toArray(initialProps.styles)]
					)}
				</>
			),
		};
	}

	render() {
		return (
			<Html data-ampdevmode>
				<Head>
					<link rel='manifest' crossOrigin='use-credentials' href='/manifest.json' />
					<link rel='apple-touch-icon' href='/icon.png'></link>
					<meta name='theme-color' content='#fff' />
					<script
						async
						custom-element='amp-script'
						src='https://cdn.ampproject.org/v0/amp-script-0.1.js'
					></script>

					<script
						async
						defer
						src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=places&language=vi`}
					/>
					<script
						async
						defer
						crossOrigin='anonymous'
						src='https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v14.0'
						nonce='bd75iZzj'
					></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', { page_path: window.location.pathname });
							`,
						}}
					/>
					<script async src='https://www.google-analytics.com/analytics.js' />
					<script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>

					<Script async src='https://cdn.ampproject.org/v0.js'></Script>
					<Script
						async
						custom-element='amp-bind'
						src='https://cdn.ampproject.org/v0/amp-bind-0.1.js'
					/>

					<Script
						async
						custom-element='amp-render'
						src='https://cdn.ampproject.org/v0/amp-render-1.0.js'
					></Script>
					<Script
						async
						custom-template='amp-mustache'
						src='https://cdn.ampproject.org/v0/amp-mustache-0.2.js'
					></Script>
					<Script
						async
						defer
						src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=places&language=vi`}
					/>
					<Script async src='https://www.google-analytics.com/analytics.js' />
					<Script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>
					<Script
						async
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
							const html = '<iframe id="vuivui-chat-app" name="vuivui-chat-app" class="fixed z-[99] hidden" allow="camera *;microphone *" placeholder="loading...." src="${process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT}" title="vuivui-chat-app"></iframe>'; 
							document.body.innerHTML += html;
							`,
						}}
					/>
				</Head>
				<body>
					<Main />
					<div id='vuivui-portal' />
					<NextScript />
				</body>
			</Html>
		);
	}
}
