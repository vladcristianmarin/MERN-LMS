import styled from '@emotion/styled';
import {
	Typography,
	Link as MUILink,
	Card,
	Container,
	Stack,
	Divider,
} from '@mui/material';

import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginScreen = () => {
	const RootStyle = styled('div')(({ theme }) => ({
		[theme.breakpoints.up('md')]: { display: 'flex' },
	}));

	const HeaderStyle = styled('header')(({ theme }) => ({
		top: 0,
		zIndex: 9,
		lineHeight: 0,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		position: 'absolute',
		padding: theme.spacing(1.5),
		justifyContent: 'space-between',
		[theme.breakpoints.up('md')]: {
			alignItems: 'flex-start',
			padding: theme.spacing(7, 5, 0, 7),
		},
	}));

	const SectionStyle = styled(Card)(({ theme }) => ({
		width: '100%',
		maxWidth: 464,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		margin: theme.spacing(2, 0, 2, 2),
	}));

	const ContentStyle = styled('div')(({ theme }) => ({
		maxWidth: 480,
		margin: 'auto',
		display: 'flex',
		minHeight: '100vh',
		flexDirection: 'column',
		justifyContent: 'center',
		padding: theme.spacing(12, 0),
	}));

	return (
		<RootStyle title='Register | WeKlass'>
			<HeaderStyle>
				<Typography
					sx={{ mt: { md: -3 }, ml: -1 }}
					variant='h2'
					color='primary'>
					WeKlass
				</Typography>
				<Typography
					variant='body2'
					sx={{
						display: { xs: 'none', sm: 'block' },
						mt: { md: -2 },
					}}>
					Don’t have an account? &nbsp;
					<MUILink
						underline='none'
						variant='subtitle2'
						component={Link}
						to='/register'>
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
						<MUILink
							variant='subtitle2'
							component={Link}
							to='register'
							underline='hover'>
							Get started
						</MUILink>
					</Typography>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
};

export default LoginScreen;
