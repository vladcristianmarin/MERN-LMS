import { CircularProgress, Container, Typography } from '@mui/material';
import React from 'react';

const LogoutLoading = () => {
	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100vw',
				gap: 1,
				height: 'calc(100vh - 216px)',
			}}>
			<Typography variant='h5'>Logging out</Typography>
			<CircularProgress />
		</Container>
	);
};

export default LogoutLoading;
