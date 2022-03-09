import React, { useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

import {
	Link as MUILink,
	Stack,
	Checkbox,
	TextField,
	IconButton,
	InputAdornment,
	FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/Iconify';

const LoginForm = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const LoginSchema = Yup.object().shape({
		email: Yup.string()
			.email('Email must be a valid email address')
			.required('Email is required'),
		password: Yup.string().required('Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: LoginSchema,
		onSubmit: () => {
			navigate('/', { replace: true });
		},
	});

	const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
		formik;

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<FormikProvider value={formik}>
			<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					<TextField
						fullWidth
						autoComplete='username'
						type='email'
						label='Email Address'
						{...getFieldProps('email')}
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>
					<TextField
						fullWidth
						autoComplete='current-password'
						type={showPassword ? 'text' : 'password'}
						label='Password'
						{...getFieldProps('password')}
						error={Boolean(touched.password && errors.password)}
						helperText={touched.password && errors.password}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={handleShowPassword} edge='end'>
										<Iconify
											icon={
												showPassword ? 'eva:eye-outline' : 'eva:eye-off-outline'
											}
										/>
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Stack>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					sx={{ my: 2 }}>
					<FormControlLabel
						control={
							<Checkbox
								{...getFieldProps('remember')}
								checked={values.remember}
							/>
						}
						label='Remember me'
					/>
					<MUILink
						component={Link}
						variant='subtitle2'
						to='#'
						underline='hover'>
						Forgot password?
					</MUILink>
				</Stack>

				<LoadingButton
					fullWidth
					size='large'
					type='submit'
					variant='contained'
					loading={isSubmitting}>
					Login
				</LoadingButton>
			</Form>
		</FormikProvider>
	);
};

export default LoginForm;
