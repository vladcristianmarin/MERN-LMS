import { Typography, Link as MUILink, Container, Stack, Divider } from '@mui/material';

import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { ContentStyle, HeaderStyle, RootStyle, SectionStyle } from './styles/GeneralStyles';

const LoginScreen = () => {
	return (
		<RootStyle title='Register | WeKlass'>
			<HeaderStyle>
				<Typography sx={{ mt: { md: -3 }, ml: -1 }} variant='h2' color='primary'>
					WeKlass
				</Typography>
				<Typography
					variant='body2'
					sx={{
						display: { xs: 'none', sm: 'block' },
						mt: { md: -2 },
					}}>
					Don’t have an account? &nbsp;
					<MUILink underline='none' variant='subtitle2' component={Link} to='/register'>
						Get started!
					</MUILink>
				</Typography>
			</HeaderStyle>

			<SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
				<Typography variant='h3' sx={{ px: 5, mt: 20, mb: 13 }}>
					Hi, Welcome Back
				</Typography>
				<img src='/images/illustration_login.png' alt='login' />
			</SectionStyle>

			<Container maxWidth='sm'>
				<ContentStyle>
					<Stack sx={{ mb: 2.5 }}>
						<Typography variant='h4' gutterBottom>
							Sign in to WeKlass
						</Typography>
						<Typography color='text.secondary' gutterBottom>
							Enter your details below
						</Typography>
					</Stack>
					<Divider sx={{ mb: 2.5 }} />
					<LoginForm />

					<Typography
						variant='body2'
						align='center'
						sx={{
							mt: 3,
							display: { sm: 'none' },
						}}>
						Don’t have an account?&nbsp;
						<MUILink variant='subtitle2' component={Link} to='register' underline='hover'>
							Get started
						</MUILink>
					</Typography>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
};

export default LoginScreen;
