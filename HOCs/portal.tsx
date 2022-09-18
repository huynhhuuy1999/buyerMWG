import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
interface IPortalProps {
	children: React.ReactNode;
}

const Portal: React.FC<IPortalProps> = ({ children }) => {
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	return mounted
		? ReactDOM.createPortal(children, document.getElementById('vuivui-portal') as HTMLElement)
		: null;
};

export default Portal;
