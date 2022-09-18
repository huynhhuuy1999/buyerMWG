import Router from 'next/router';
import React, { ErrorInfo } from 'react';

interface State {
	hasError: boolean;
}

class ErrorBoundary extends React.Component {
	public state: State = {
		hasError: false,
	};

	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		// console.log('first', this.props.deviceType);
		Router.push({
			pathname: '/error',
		});
		return { hasError: false };
	}
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, errorInfo);
	}
	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
