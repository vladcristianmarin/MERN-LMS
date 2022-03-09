import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import SimpleBarReact from 'simplebar-react';
import React from 'react';
import { alpha, Box } from '@mui/material';

const ScrollBar = ({ children, sx, ...other }) => {
	const RootStyle = styled('div')({
		flexGrow: 1,
		height: '100%',
		overflow: 'hidden',
	});

	const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
		maxHeight: '100%',
		'& .simplebar-scrollbar': {
			'&:before': {
				backgroundColor: alpha(theme.palette.grey[600], 0.48),
			},
			'&.simplebar-visible:before': {
				opacity: 1,
			},
		},
		'& .simplebar-track.simplebar-vertical': {
			width: 10,
		},
		'& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
			height: 6,
		},
		'& .simplebar-mask': {
			zIndex: 'inherit',
		},
	}));

	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	if (isMobile) {
		return (
			<Box sx={{ overflow: 'auto', ...sx }} {...other}>
				{children}
			</Box>
		);
	}

	return (
		<RootStyle>
			<SimpleBarStyle timeout={500} clickOnTrack={false} sx={sx} {...other}>
				{children}
			</SimpleBarStyle>
		</RootStyle>
	);
};

ScrollBar.propTypes = {
	children: PropTypes.node.isRequired,
	sx: PropTypes.object,
};

export default ScrollBar;
