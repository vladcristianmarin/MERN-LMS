import styled from '@emotion/styled';
import * as Yup from 'yup';
import FileUpload from 'react-material-file-upload';
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
	Input,
	Fab,
	IconButton,
	Tooltip,
} from '@mui/material';
import AdapterDateFns from '@date-io/date-fns';
import { LoadingButton, LocalizationProvider, TimePicker } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { COURSE_CREATE_RESET } from '../../constants/courseConstants';
import Toast from '../Toast';
import { createCourse } from '../../actions/courseActions';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import Iconify from '../Iconify';

const RootStyle = styled(Card)(({ theme }) => ({
	maxWidth: '40%',
	padding: theme.spacing(2, 0),
	boxShadow: theme.customShadows.primary,
	color: theme.palette.primary.darker,
	backgroundColor: theme.palette.primary.lighter,
}));

const CreateResourceForm = () => {
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
				console.log(value);
				if (!value || !value.length) return true;
				return value[0].size <= 2000000;
			}),
	});

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			file: null,
		},
		validationSchema: CreateResourceSchema,
		onSubmit(values) {
			const { title, description, file } = values;
			console.log(title, description, file);
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
		if (files.length > 0) {
			setFieldValue('file', files[0]);
		}
	}, [setFieldValue, files]);

	const resetCreateState = () => {
		dispatch({ type: COURSE_CREATE_RESET });
	};

	const cancelFormHandler = () => {
		handleReset();
	};

	console.log(errors.file, touched.file);

	return (
		<>
			{!showForm ? (
				<Fab variant='extended' color='primary' aria-label='add' onClick={() => setShowForm(true)}>
					<Iconify icon='eva:plus-outline' sx={{ width: 24, height: 24, mr: theme.spacing(1) }} />
					Upload Resource
				</Fab>
			) : (
				<RootStyle>
					{/* <Toast show={error && !loading} timeout={3000} severity='error' message={error} onClose={resetCreateState} />
			<Toast
				show={success && !loading}
				timeout={2000}
				severity='success'
				message='Course created!'
				onClose={resetCreateState}
			/> */}

					<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: theme.spacing(1) }}>
						<Typography variant='h5' sx={{ textAlign: 'start', ml: theme.spacing(1) }}>
							Add Resource
						</Typography>
						<Tooltip title='Hide'>
							<IconButton color='default' onClick={() => setShowForm(false)}>
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
								<FormControl {...getFieldProps('file')}>
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
