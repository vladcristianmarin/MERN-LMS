import React from 'react';
import { Typography } from '@mui/material';
import { FooterStyles } from './styles/FooterStyles';
import { useSelector } from 'react-redux';

const Footer = () => {
	const { isOpen } = useSelector((state) => state.sidebar);

	return (
		<FooterStyles open={isOpen}>
			<Typography color='primary' variant='subtitle2' textAlign='center'>
				<span style={{ color: '#212B36' }}>Copyright &copy;</span> WeKlass
			</Typography>
		</FooterStyles>
	);
};

export default Footer;
