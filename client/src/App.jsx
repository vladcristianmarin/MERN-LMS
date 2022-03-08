import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';

import Header from './components/Header';

const App = () => {
	return (
		<ThemeConfig>
			<GlobalStyles />
			<Router>
				<Header />
				<ScrollToTop />
				<main className='py-3'></main>
			</Router>
		</ThemeConfig>
	);
};

export default App;
