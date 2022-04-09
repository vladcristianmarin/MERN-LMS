import styled from '@emotion/styled';
import * as Yup from 'yup';
import {
	Card,
	Stack,
	TextField,
	Typography,
	Button,
	Autocomplete,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
} from '@mui/material';
import AdapterDateFns from '@date-io/date-fns';
import { LoadingButton, LocalizationProvider, TimePicker } from '@mui/lab';
import React, { useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { COURSE_CREATE_RESET } from '../../constants/courseConstants';
import Toast from '../Toast';
import { createCourse } from '../../actions/courseActions';
import { Box } from '@mui/system';

const RootStyle = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3, 0),
	boxShadow: theme.customShadows.secondary,
	color: theme.palette.secondary.darker,
	backgroundColor: theme.palette.secondary.lighter,
}));

const CreateCourseForm = () => {
	const dispatch = useDispatch();

	const courseCreate = useSelector((state) => state.courseCreate);
	const { error, loading, success } = courseCreate;

	const teacherList = useSelector((state) => state.teacherList);
	const teachers = teacherList.teachers || [];

	const teachersEmails = teachers.map((teacher) => teacher.email);

	const CreateCourseSchema = Yup.object().shape({
		name: Yup.string().required('Name is required'),
		acronym: Yup.string().required('Acronym is required').max(5, 'Acronym is too long. (Avoid dots)'),
		teacher: Yup.string().email("Teacher's email is required").required('Teacher is required'),
		description: Yup.string().required('Description is required'),
		weekday: Yup.string().required('Weekday is required'),
		hour: Yup.date().required('Hour is required'),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			acronym: '',
			teacher: '',
			description: '',
			weekday: '',
			hour: '',
		},
		validationSchema: CreateCourseSchema,
		onSubmit(values) {
			const { name, acronym, teacher, description } = values;
			dispatch(createCourse(name, acronym, teacher, description));
		},
	});

	const {
		errors,
		touched,
		setFieldValue,
		isSubmitting,
		setSubmitting,
		handleSubmit,
		handleReset,
		getFieldProps,
		values,
	} = formik;

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (success) {
			handleReset();
		}
		// eslint-disable-next-line
	}, [loading, success]);

	const resetCreateState = () => {
		dispatch({ type: COURSE_CREATE_RESET });
	};

	return (
		<RootStyle>
			<Toast show={error && !loading} timeout={3000} severity='error' message={error} onClose={resetCreateState} />
			<Toast
				show={success && !loading}
				timeout={2000}
				severity='success'
				message='Course created!'
				onClose={resetCreateState}
			/>

			<Typography variant='h4' sx={{ textAlign: 'center' }}>
				Create New Course
			</Typography>
			<FormikProvider value={formik}>
				<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
					<Stack spacing={1} sx={{ p: 2, flexWrap: 'wrap' }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1 }}>
							<TextField
								fullWidth
								color='secondary'
								type='text'
								label='Name'
								{...getFieldProps('name')}
								error={Boolean(touched.name && errors.name)}
								helperText={touched.name && errors.name}
							/>
							<TextField
								fullWidth
								color='secondary'
								type='text'
								label='Acronym'
								{...getFieldProps('acronym')}
								error={Boolean(touched.acronym && errors.acronym)}
								helperText={touched.acronym && errors.acronym}
							/>
						</Box>
						<TextField
							fullWidth
							multiline
							color='secondary'
							type='text'
							label='Description'
							{...getFieldProps('description')}
							error={Boolean(touched.description && errors.description)}
							helperText={touched.description && errors.description}
						/>
						<Autocomplete
							key={loading}
							disablePortal
							id='teachers'
							options={teachersEmails}
							onChange={(_e, value, reason) => {
								setFieldValue('teacher', value);
								if (reason === 'clear') setFieldValue('teacher', '');
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									color='secondary'
									label='Teacher'
									{...getFieldProps('teacher')}
									error={Boolean(touched.teacher && errors.teacher)}
									helperText={touched.teacher && errors.teacher}
								/>
							)}
						/>
						<Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1 }}>
							<Box>
								<FormControl fullWidth {...getFieldProps('weekday')} error={Boolean(touched.weekday && errors.weekday)}>
									<InputLabel id='weekday-select-label' color='secondary'>
										Weekday
									</InputLabel>
									<Select
										id='weekday-select'
										labelId='weekday-select-label'
										value={values.weekday}
										label='Weekday'
										color='secondary'
										onChange={(e) => {
											setFieldValue('weekday', e.target.value);
										}}>
										{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
											<MenuItem key={i} value={day.toLocaleLowerCase()}>
												{day}
											</MenuItem>
										))}
									</Select>
									{Boolean(touched.weekday && errors.weekday) && (
										<FormHelperText error={true}>{errors.weekday}</FormHelperText>
									)}
								</FormControl>
							</Box>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<TimePicker
									ampm={false}
									label='Hour'
									value={values.hour}
									onChange={(date) => {
										setFieldValue('hour', date);
									}}
									renderInput={(params) => (
										<TextField
											color='secondary'
											{...params}
											{...getFieldProps('hour')}
											error={Boolean(touched.hour && errors.hour)}
											helperText={touched.hour && errors.hour}
											onChange={(e) => {
												setFieldValue(e.target.valueAsDate);
											}}
										/>
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Stack spacing={3} direction='row' sx={{ pt: 2 }}>
							<LoadingButton
								color='secondary'
								fullWidth
								size='large'
								type='submit'
								variant='contained'
								loading={isSubmitting}>
								Create
							</LoadingButton>
							<Button fullWidth color='error' size='large' type='submit' variant='contained' onClick={handleReset}>
								Cancel
							</Button>
						</Stack>
					</Stack>
				</Form>
			</FormikProvider>
		</RootStyle>
	);
};

export default CreateCourseForm;
