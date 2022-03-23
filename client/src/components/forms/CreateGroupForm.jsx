import styled from '@emotion/styled';
import * as Yup from 'yup';
import { Card, Stack, TextField, Typography, Button, Chip, Autocomplete } from '@mui/material';
import React from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';

const RootStyle = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3, 0),
	boxShadow: theme.customShadows.primary,
	color: theme.palette.primary.darker,
	backgroundColor: theme.palette.primary.lighter,
}));

const CreateGroupForm = () => {
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
			console.log(values);
			handleReset();
		},
	});

	const {
		errors,
		setErrors,
		touched,
		values,
		setFieldValue,
		isSubmitting,
		setSubmitting,
		handleSubmit,
		handleReset,
		handleBlur,
		getFieldProps,
		handleChange,
	} = formik;

	return (
		<RootStyle>
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
