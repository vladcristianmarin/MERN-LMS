import React from 'react';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';

import Routes from './routes';

const App = () => {
	return (
		<ThemeConfig>
			<GlobalStyles />
			<ScrollToTop />
			<Routes />
		</ThemeConfig>
	);
};

export default App;
