import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
	Box,
	Card,
	Link as MUILink,
	Container,
	Typography,
	Divider,
	ButtonGroup,
	Button,
	ToggleButtonGroup,
	ToggleButton,
} from '@mui/material';

import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterScreen = () => {
	const RootStyle = styled('div')(({ theme }) => ({
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
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

	const [role, setRole] = useState('student');

	const selectRoleHandler = (e, role) => {
		setRole(role);
	};

	return (
		<RootStyle>
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
					Already have an account? &nbsp;
					<MUILink
						underline='none'
						variant='subtitle2'
						component={Link}
						to='/login'>
						Login!
					</MUILink>
				</Typography>
			</HeaderStyle>

			<SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
				<Typography variant='h3' sx={{ px: 5, mt: 15, mb: 12 }}>
					Learning made easier with WeKlass!
				</Typography>
				<img src='/images/illustration_register.png' alt='login' />
			</SectionStyle>

			<Container>
				<ContentStyle>
					<Box sx={{ mb: 2.5 }}>
						<Typography variant='h4' gutterBottom>
							Get started absolutely free.
						</Typography>
						<Typography sx={{ color: 'text.secondary' }}>
							By students for students
						</Typography>
					</Box>
					<Divider sx={{ mb: 2.5 }} />
					<ToggleButtonGroup
						exclusive
						value={role}
						onChange={selectRoleHandler}
						sx={{ display: 'flex', flexWrap: 'wrap' }}>
						<ToggleButton
							sx={{ flex: '1' }}
							color='primary'
							value='student'
							aria-label='left aligned'>
							Student
						</ToggleButton>
						<ToggleButton
							sx={{ flex: '1' }}
							color='primary'
							value='teacher'
							aria-label='right aligned'>
							Teacher
						</ToggleButton>
					</ToggleButtonGroup>

					<RegisterForm variant={role} />

					<Typography
						variant='subtitle2'
						sx={{
							mt: 3,
							textAlign: 'center',
							display: { sm: 'none' },
						}}>
						Already have an account?&nbsp;
						<MUILink underline='hover' to='/login' component={Link}>
							Login
						</MUILink>
					</Typography>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
};

export default RegisterScreen;
