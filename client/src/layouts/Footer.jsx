import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
	return (
		<footer style={{ gridColumn: '1/-1' }}>
			<Container sx={{ display: 'flex', justifyContent: 'center', py: 5, m: 0 }} maxWidth='inherit'>
				<Typography variant='body1' textAlign='center'>
					Copyright &copy; WeKlass
				</Typography>
			</Container>
		</footer>
	);
};

export default Footer;
