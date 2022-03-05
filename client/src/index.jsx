import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primereact/resources/themes/tailwind-light/theme.css'; //theme
import './index.css';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
