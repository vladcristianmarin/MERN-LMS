import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';

import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { Card, Stack, TextField, Typography, Button, FormControl, Fab, IconButton, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FileUpload from 'react-material-file-upload';

import Toast from '../Toast';
import Iconify from '../Iconify';

import { uploadResource } from '../../actions/courseActions';
import { COURSE_UPLOAD_RESOURCE_RESET } from '../../constants/courseConstants';

const RootStyle = styled(Card)(({ theme }) => ({
	maxWidth: '40%',
	padding: theme.spacing(2, 0),
	boxShadow: theme.customShadows.primary,
	color: theme.palette.primary.darker,
	backgroundColor: theme.palette.primary.lighter,
}));

const CreateResourceForm = ({ courseId }) => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [files, setFiles] = useState([]);
	const [showForm, setShowForm] = useState(false);

	const CreateResourceSchema = Yup.object().shape({
		title: Yup.string().required('Name is required'),
		description: Yup.string().required('Description is required'),
		file: Yup.mixed()
			.required('File is required!')
			.test('fileSize', 'The file is too large', (value) => {
				if (!value || !value.length) return true;
				return value[0].size <= 2000000;
			}),
	});

	const { loading, success, error } = useSelector((state) => state.courseUploadResource);

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			file: null,
		},
		validationSchema: CreateResourceSchema,
		onSubmit(values) {
			const { title, description, file } = values;
			dispatch(uploadResource(courseId, title, description, file));
		},
	});

	const { errors, touched, setFieldValue, isSubmitting, setSubmitting, handleSubmit, handleReset, getFieldProps } =
		formik;

	useEffect(() => {
		if (files.length > 0) {
			setFieldValue('file', files[0]);
		}
	}, [setFieldValue, files]);

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (success) {
			setFiles([]);
			handleReset();
		}
		// eslint-disable-next-line
	}, [loading, success]);

	const resetCreateState = () => {
		dispatch({ type: COURSE_UPLOAD_RESOURCE_RESET });
	};

	const cancelFormHandler = () => {
		handleReset();
	};

	return (
		<>
			<Toast show={error && !loading} timeout={3000} severity='error' message={error} onClose={resetCreateState} />
			<Toast
				show={success && !loading}
				timeout={2000}
				severity='success'
				message='Resource uploaded!'
				onClose={resetCreateState}
			/>
			{!showForm ? (
				<Fab variant='extended' color='primary' aria-label='add' onClick={() => setShowForm(true)}>
					<Iconify icon='eva:plus-outline' sx={{ width: 24, height: 24, mr: theme.spacing(1) }} />
					Upload Resource
				</Fab>
			) : (
				<RootStyle>
					<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: theme.spacing(1) }}>
						<Typography variant='h5' sx={{ textAlign: 'start', ml: theme.spacing(1) }}>
							Add Resource
						</Typography>
						<Tooltip title='Hide'>
							<IconButton
								color='default'
								onClick={() => {
									setShowForm(false);
									cancelFormHandler();
								}}>
								<Iconify icon='eva:minus-circle-outline' />
							</IconButton>
						</Tooltip>
					</Stack>

					<FormikProvider value={formik}>
						<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
							<Stack spacing={1} sx={{ p: 1 }}>
								<TextField
									size='small'
									color='primary'
									type='text'
									label='Title'
									{...getFieldProps('title')}
									error={Boolean(touched.title && errors.title)}
									helperText={touched.title && errors.title}
								/>
								<TextField
									size='small'
									multiline
									color='primary'
									type='text'
									label='Description'
									{...getFieldProps('description')}
									error={Boolean(touched.description && errors.description)}
									helperText={touched.description && errors.description}
								/>
								<FormControl type='file' label='File' name='file' id='file'>
									<FileUpload
										value={files}
										onChange={(file) => {
											setFiles(file);
										}}
									/>
									{errors.file && touched.file && (
										<Typography sx={{ ml: '14px', mt: '6px', fontSize: '0.75rem', fontWeight: '400' }} color='error'>
											{errors.file}
										</Typography>
									)}
								</FormControl>

								<Stack spacing={2} direction='row' sx={{ pt: 2 }}>
									<LoadingButton
										color='primary'
										fullWidth
										type='submit'
										variant='contained'
										loading={isSubmitting}
										startIcon={<Iconify icon='eva:checkmark-circle-2-outline' />}>
										Submit
									</LoadingButton>
									<Button
										fullWidth
										color='error'
										variant='contained'
										onClick={cancelFormHandler}
										endIcon={<Iconify icon='eva:backspace-outline' />}>
										Clear
									</Button>
								</Stack>
							</Stack>
						</Form>
					</FormikProvider>
				</RootStyle>
			)}
		</>
	);
};

export default CreateResourceForm;
