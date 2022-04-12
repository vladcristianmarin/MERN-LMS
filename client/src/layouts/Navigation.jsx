import React from 'react';
import { List } from '@mui/material';
import { Box } from '@mui/system';
import { matchPath, useLocation } from 'react-router-dom';
import NavItem from '../components/NavItem';

const Navigation = ({ navConfig, ...other }) => {
	const { pathname } = useLocation();
	console.log(navConfig);
	const match = (path) => (path ? !!matchPath({ path, end: true }, pathname) : false);
	return (
		<Box {...other}>
			<List>
				{navConfig.map((item) => (
					<NavItem key={item.title} item={item} active={match} />
				))}
			</List>
		</Box>
	);
};

export default Navigation;
