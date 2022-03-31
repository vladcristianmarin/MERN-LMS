import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import {
	Stack,
	TextField,
	IconButton,
	InputAdornment,
	Autocomplete,
	Divider,
	Typography,
	List,
	ListItem,
	Box,
	FormControl,
	Grid,
	Card,
	Fade,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../Iconify';
import { strengthColor, strengthIndicator } from '../../utils/passwordStrength';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { register } from '../../actions/userActions';
import Toast from '../Toast';

const RegisterForm = ({ variant }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();

	const [showPassword, setShowPassword] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [countries, setCountries] = useState([]);
	const [level, setLevel] = useState();
	const [strength, setStrength] = useState(0);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userRegister = useSelector((state) => state.userRegister);
	const { error: registerError, loading: registerLoading, success: registerSuccess } = userRegister;

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
	}, []);

	useEffect(() => {
		if (userInfo) {
			navigate('/', { replace: true });
		}
	}, [userInfo, navigate]);

	const RegisterSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Too Short').max(50, 'Too Long').required('Name is required'),
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
		phoneNumber: Yup.string().min(10, 'Too Short').required('Phone Number is required'),
		country: Yup.string().required('Please choose a country'),
		password: Yup.string().required('Password is required'),
		passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
		...(variant === 'teacher' && {
			title: Yup.string().min(2, 'Too Short').max(50, 'Too Long').required('Title is required'),
			school: Yup.string().min(2, 'Too Short').max(50, 'Too Long').required('School name is required'),
		}),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			phoneNumber: '',
			country: '',
			password: '',
			passwordConfirmation: '',
			...(variant === 'teacher' && { school: '', title: '' }),
		},
		validationSchema: RegisterSchema,

		onSubmit(values) {
			if (values.password === values.passwordConfirmation) {
				const userData = { ...values };
				delete userData.passwordConfirmation;
				userData.role = variant;
				dispatch(register(userData));
			}
		},
	});

	const {
		errors,
		touched,
		handleSubmit,
		handleChange,
		handleBlur,
		handleReset,
		isSubmitting,
		setSubmitting,
		getFieldProps,
		values,
		setFieldValue,
	} = formik;

	useEffect(() => {
		if (!registerLoading) {
			setSubmitting(false);
		}
		if (registerError) {
			setShowAlert(true);
			handleReset();
		}
		if (registerSuccess) {
			setShowAlert(false);
			handleReset();
			navigate('/', { replace: true });
		}
		// eslint-disable-next-line
	}, [registerLoading, registerError]);

	const ColorBox = styled(Box)(() => ({
		display: 'inline-block',
		background: theme.palette.text.primary,
		width: 7,
		marginRight: '6px',
		height: 7,
		borderRadius: '3.5px',
	}));

	const passwordStrengthPopup = (
		<Fade in={values.password.length !== 0 && isPasswordFocused} timeout={1000}>
			<Card sx={{ px: 2, py: 1 }}>
				<Typography variant='h6'>Pick a password</Typography>
				<FormControl fullWidth>
					<Box>
						<Grid container spacing={2} alignItems='center'>
							<Grid item>
								<Box
									sx={{
										width: `calc(45px * ${strength + 1})`,
										height: 8,
										borderRadius: '7px',
										bgcolor: level?.color,
									}}
								/>
							</Grid>
							<Grid item>
								<Typography variant='subtitle1' fontSize='0.75rem'>
									{level?.label}
								</Typography>
							</Grid>
						</Grid>
					</Box>
					<Divider sx={{ my: 1 }} />
					<Box>
						<Typography variant='subtitle2'>Suggestions</Typography>
						<List>
							<ListItem>
								<ColorBox />
								At least one lowercase
							</ListItem>
							<ListItem>
								<ColorBox />
								At least one uppercase
							</ListItem>
							<ListItem>
								<ColorBox />
								At least one numeric
							</ListItem>
							<ListItem>
								<ColorBox />
								At least one special character
							</ListItem>
							<ListItem>
								<ColorBox />
								Minimum 8 characters
							</ListItem>
						</List>
					</Box>
				</FormControl>
			</Card>
		</Fade>
	);

	return (
		<FormikProvider value={formik}>
			<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
				<Toast
					show={showAlert}
					timeout={3000}
					severity='error'
					onClose={() => setShowAlert(false)}
					message={registerError}
				/>
				<Stack sx={{ marginTop: 1 }} spacing={1}>
					<TextField
						fullWidth
						autoComplete='name'
						type='text'
						label='Name'
						{...getFieldProps('name')}
						error={Boolean(touched.name && errors.name)}
						helperText={touched.name && errors.name}
					/>
					<TextField
						fullWidth
						autoComplete='email'
						type='email'
						label='Email'
						{...getFieldProps('email')}
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>
					<TextField
						fullWidth
						autoComplete='phoneNumber'
						type='text'
						label='Phone Number'
						{...getFieldProps('phoneNumber')}
						error={Boolean(touched.phoneNumber && errors.phoneNumber)}
						helperText={touched.phoneNumber && errors.phoneNumber}
					/>

					<Autocomplete
						key={registerSuccess}
						disablePortal
						id='country'
						options={countries}
						onChange={(_e, value) => setFieldValue('country', value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Country'
								{...getFieldProps('country')}
								error={Boolean(touched.country && errors.country)}
								helperText={touched.country && errors.country}
							/>
						)}
					/>
					{variant === 'teacher' && (
						<>
							<TextField
								fullWidth
								autoComplete='school'
								type='text'
								label='School'
								{...getFieldProps('school')}
								error={Boolean(touched.school && errors.school)}
								helperText={touched.school && errors.school}
							/>
							<TextField
								fullWidth
								autoComplete='title'
								type='text'
								label='Title'
								{...getFieldProps('title')}
								error={Boolean(touched.title && errors.title)}
								helperText={touched.title && errors.title}
							/>
						</>
					)}

					<TextField
						autoComplete='current-password'
						type={showPassword ? 'text' : 'password'}
						label='Password'
						{...getFieldProps('password')}
						onChange={(e) => {
							handleChange(e);
							const str = strengthIndicator(e.target.value);
							setStrength(str);
							const color = strengthColor(str, theme);
							setLevel(color);
						}}
						onFocus={() => setIsPasswordFocused(true)}
						onBlur={(e) => {
							handleBlur(e);
							setIsPasswordFocused(false);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton edge='end' onClick={() => setShowPassword((prev) => !prev)}>
										<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
									</IconButton>
								</InputAdornment>
							),
						}}
						error={Boolean(touched.password && errors.password)}
						helperText={touched.password && errors.password}
					/>
					{values.password.length !== 0 && isPasswordFocused && passwordStrengthPopup}

					<TextField
						fullWidth
						autoComplete='current-password'
						type={showPassword ? 'text' : 'password'}
						label='Confirm Password'
						{...getFieldProps('passwordConfirmation')}
						error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
						helperText={touched.passwordConfirmation && errors.passwordConfirmation}
					/>

					<LoadingButton fullWidth size='large' type='submit' variant='contained' loading={isSubmitting}>
						Register
					</LoadingButton>
				</Stack>
			</Form>
		</FormikProvider>
	);
};

RegisterForm.propTypes = {
	variant: PropTypes.string.isRequired,
};

export default RegisterForm;
