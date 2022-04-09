import React from 'react';

import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';

import Routes from './router';
import AuthCheck from './components/AuthCheck';

import './index.css';

const App = () => {
	return (
		<ThemeConfig>
			<GlobalStyles />
			<ScrollToTop />
			<AuthCheck />
			<Routes />
		</ThemeConfig>
	);
};

export default App;
