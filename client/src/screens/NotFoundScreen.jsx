import styled from '@emotion/styled';
import { Button, Container, Typography, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundScreen = () => {
	const RootStyle = styled('div')(({ theme }) => ({
		display: 'flex',
		minHeight: '100%',
		alignItems: 'center',
		paddingTop: theme.spacing(15),
		paddingBottom: theme.spacing(10),
	}));

	return (
		<RootStyle>
			<Container>
				<Box sx={{ maxWidht: 480, margin: 'auto', textAlign: 'center' }}>
					<Typography variant='h3' paragraph>
						Sorry, page not found!
					</Typography>
					<Typography sx={{ color: 'text.secondary' }}>
						Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
						mistyped the URL? Be sure to check your spelling.
					</Typography>

					<Box
						component='img'
						src='/images/illustration_404.svg'
						alt='404 page not found'
						sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
					/>

					<Button to='/' size='large' variant='primary' component={Link}>
						&larr; Go to Home
					</Button>
				</Box>
			</Container>
		</RootStyle>
	);
};

export default NotFoundScreen;
