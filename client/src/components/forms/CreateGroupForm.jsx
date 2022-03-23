import styled from '@emotion/styled';
import * as Yup from 'yup';
import { Card, Stack, TextField, Typography, Button, Chip, Autocomplete } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { createCourse } from '../../actions/courseActions';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../Toast';
import { COURSE_CREATE_RESET } from '../../constants/courseConstants';

const RootStyle = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3, 0),
	boxShadow: theme.customShadows.primary,
	color: theme.palette.primary.darker,
	backgroundColor: theme.palette.primary.lighter,
}));

const CreateGroupForm = () => {
	const [showAlert, setShowAlert] = useState(false);

	const dispatch = useDispatch();

	const courseCreate = useSelector((state) => state.courseCreate);
	const { error, loading, success } = courseCreate;

	const CreateGroupSchema = Yup.object().shape({
		code: Yup.string().required('Code is required'),
		school: Yup.string().required('School is required'),
		students: Yup.array().of(Yup.string()).min(1, 'At least 1 email is required!'),
	});

	const formik = useFormik({
		initialValues: {
			code: '',
			school: '',
			students: [],
		},
		validationSchema: CreateGroupSchema,
		onSubmit(values, actions) {
			const { name, acronym, teacher, description } = values;
			dispatch(createCourse(name, acronym, teacher, description));
			handleReset();
		},
	});

	const {
		errors,
		touched,
		values,
		setFieldValue,
		isSubmitting,
		setSubmitting,
		handleSubmit,
		handleReset,
		getFieldProps,
	} = formik;

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (error) {
			handleReset();
		}
		if (success) {
			dispatch({ type: COURSE_CREATE_RESET });
			handleReset();
		}
		// eslint-disable-next-line
	}, [loading, error]);

	return (
		<RootStyle>
			<Toast show={showAlert} timeout={500} severity='error' onClose={() => setShowAlert(false)} message={error} />
			<Toast
				show={showAlert}
				timeout={500}
				severity='success'
				onClose={() => setShowAlert(false)}
				message='Course created!'
			/>
			<Typography
				variant='h4'
				sx={{
					textAlign: 'center',
				}}>
				Create New Group
			</Typography>
			<FormikProvider value={formik}>
				<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
					<Stack spacing={1} sx={{ p: 2, flexWrap: 'wrap' }}>
						<TextField
							fullWidth
							type='text'
							label='Group Code (unique)'
							{...getFieldProps('code')}
							error={Boolean(touched.code && errors.code)}
							helperText={touched.code && errors.code}
						/>
						<TextField
							fullWidth
							type='text'
							label='School name'
							{...getFieldProps('school')}
							error={Boolean(touched.school && errors.school)}
							helperText={touched.school && errors.school}
						/>
						<TextField
							fullWidth
							type='text'
							label='Year of study'
							{...getFieldProps('school')}
							error={Boolean(touched.school && errors.school)}
							helperText={touched.school && errors.school}
						/>

						<Autocomplete
							multiple
							id='tags-filled'
							value={values.students}
							freeSolo
							options={[]}
							onChange={(e, val) => setFieldValue('students', val)}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => <Chip color='primary' label={option} {...getTagProps({ index })} />)
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Students'
									type='text'
									placeholder="Student's email"
									error={Boolean(touched.students && errors.students)}
									helperText={touched.students && errors.students}
								/>
							)}
						/>
						<Stack spacing={3} direction='row' sx={{ pt: 2 }}>
							<LoadingButton fullWidth size='large' type='submit' variant='contained' loading={isSubmitting}>
								Create
							</LoadingButton>
							<Button fullWidth size='large' color='error' type='submit' variant='contained' onClick={handleReset}>
								Cancel
							</Button>
						</Stack>
					</Stack>
				</Form>
			</FormikProvider>
		</RootStyle>
	);
};

export default CreateGroupForm;
