import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
	return (
		<footer style={{ gridColumn: '1/-1' }}>
			<Container
				sx={{
					display: 'flex',
					justifyContent: 'center',
					py: 5,
					m: 0,
					boxShadow: (theme) => theme.shadows[20],
				}}
				maxWidth='inherit'>
				<Typography color='primary' variant='subtitle2' textAlign='center'>
					<span style={{ color: '#212B36' }}>Copyright &copy;</span> WeKlass
				</Typography>
			</Container>
		</footer>
	);
};

export default Footer;
