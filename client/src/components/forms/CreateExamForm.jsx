import * as Yup from 'yup';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Container,
	List,
	TextField,
	Typography,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import AdapterDateFns from '@date-io/date-fns';
import { DateTimePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import Iconify from '../Iconify';
import React, { useEffect, useState } from 'react';
import QuestionForm from './QuestionForm';
import { listTeacherCourses } from '../../actions/teacherActions';
import { useDispatch, useSelector } from 'react-redux';
import { createExam } from '../../actions/examActions';
import Toast from '../Toast';
import { EXAM_CREATE_RESET } from '../../constants/examConstants';

const StyledContainer = styled(Container)(({ theme }) => ({
	width: '100%',
	margin: '0 auto',
	padding: theme.spacing(2, 0),
	boxShadow: `${theme.customShadows.primary}, ${theme.customShadows.z1}`,
	color: theme.palette.primary.darker,
	backgroundColor: theme.palette.primary.lighter,
	borderRadius: '11px',
}));

const CreateExamForm = () => {
	const [questions, setQuestions] = useState([]);
	const [savedQuestions, setSavedQuestions] = useState([]);
	const [clear, setClear] = useState(false);

	const theme = useTheme();
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.userLogin);
	const { loading: coursesLoading } = useSelector((state) => state.teacherListCourses);
	const courses = useSelector((state) => state.teacherListCourses).courses || [];

	const { error, loading, success } = useSelector((state) => state.examCreate);

	useEffect(() => {
		dispatch(listTeacherCourses(userInfo._id));
	}, [dispatch, userInfo]);

	const CreateExamSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
		course: Yup.string().required('Course is required').nullable(),
		date: Yup.string().required('Date and Hour is required').nullable(),
	});

	const formik = useFormik({
		initialValues: { title: '', description: '', date: '', course: '' },
		validationSchema: CreateExamSchema,
		onSubmit(values) {
			const { title, description, date, course } = values;
			dispatch(createExam(title, description, course, date, savedQuestions));
		},
	});

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (success) {
			handleReset();
			setFieldValue('date', null);
			setFieldValue('course', null);
			setQuestions([]);
			setSavedQuestions([]);
			setClear((prev) => !prev);
		}
		// eslint-disable-next-line
	}, [loading, success]);

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

	const removeQuestionHandler = (id) => {
		console.log(id);
		setQuestions((prev) => prev.filter((q) => q.key !== id));
	};

	const addQuestionHandler = () => {
		setQuestions((prev) => [
			...prev,
			<QuestionForm
				id={String(prev.length)}
				key={prev.length}
				removeQuestion={removeQuestionHandler}
				addQuestion={addQuestionHandler}
				saveQuestion={saveQuestionHandler}
			/>,
		]);
	};

	const saveQuestionHandler = (question) => {
		setSavedQuestions((prev) => [...prev, question]);
	};

	const resetCreateState = () => {
		dispatch({ type: EXAM_CREATE_RESET });
	};

	const cancelFormHandler = () => {
		handleReset();
		setFieldValue('date', null);
		setFieldValue('course', null);
		setQuestions([]);
		setSavedQuestions([]);
		setClear((prev) => !prev);
	};

	return (
		<StyledContainer maxWidth='md'>
			<Toast show={error && !loading} timeout={3000} severity='error' message={error} onClose={resetCreateState} />
			<Toast
				show={success && !loading}
				timeout={2000}
				severity='success'
				message='Survey created!'
				onClose={resetCreateState}
			/>
			<Typography variant='h4' sx={{ textAlign: 'center', mb: theme.spacing(2) }}>
				Create new survey 📄
			</Typography>
			<Card>
				<CardHeader title='Survey info' />
				<CardContent>
					<FormikProvider value={formik}>
						<Form
							id='createExamForm'
							autoComplete='off'
							autoCapitalize='on'
							noValidate
							onSubmit={handleSubmit}
							style={{ padding: theme.spacing(0, 5), display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
							<Box style={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: '1fr 1fr' }}>
								<TextField
									color='primary'
									type='text'
									label='Title'
									{...getFieldProps('title')}
									error={Boolean(touched.title && errors.title)}
									helperText={touched.title && errors.title}
								/>
								<TextField
									color='primary'
									type='text'
									label='Description'
									{...getFieldProps('description')}
									error={Boolean(touched.description && errors.description)}
									helperText={touched.description && errors.description}
								/>
								<Autocomplete
									id='courses'
									disablePortal
									key={clear}
									loading={coursesLoading}
									options={courses.map((c) => c.name)}
									onChange={(_e, value, reason) => {
										setFieldValue('course', value);
										if (reason === 'clear') setFieldValue('course', null);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											color='primary'
											label='Course'
											value={values.course}
											{...getFieldProps('course')}
											error={Boolean(touched.course && errors.course)}
											helperText={touched.course && errors.course}
										/>
									)}
								/>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										label='Date and Hour'
										ampm={false}
										value={values.date}
										onChange={(value) => {
											setFieldValue('date', value);
										}}
										renderInput={(params) => (
											<TextField
												type='time'
												{...params}
												{...getFieldProps('date')}
												error={Boolean(touched.date && errors.date)}
												helperText={touched.date && errors.date}
											/>
										)}
									/>
								</LocalizationProvider>
							</Box>
							<Button
								variant='contained'
								size='large'
								color='warning'
								sx={{
									color: '#fff',
									bgcolor: '#fab005',
									fontSize: theme.typography.h3.fontSize,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: theme.spacing(2),
									py: theme.spacing(3.5),
									// mx: theme.spacing(5),
								}}
								onClick={addQuestionHandler}>
								<Iconify icon='eva:plus-circle-outline' />
								Add Question
							</Button>
						</Form>
					</FormikProvider>
					<List sx={{ px: theme.spacing(5), gap: theme.spacing(2), display: 'flex', flexDirection: 'column' }}>
						{questions}
					</List>
				</CardContent>
			</Card>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					p: theme.spacing(2),
					justifyContent: 'flex-end',
					flex: '0 0 auto',
					gap: theme.spacing(2),
				}}>
				<LoadingButton
					loading={isSubmitting}
					type='submit'
					form='createExamForm'
					variant='contained'
					size='large'
					endIcon={<Iconify icon='eva:save-outline' />}
					sx={{ px: theme.spacing(3) }}>
					Save Survey
				</LoadingButton>
				<Button
					variant='contained'
					size='large'
					color='error'
					endIcon={<Iconify icon='eva:backspace-outline' />}
					sx={{ px: theme.spacing(3) }}
					onClick={cancelFormHandler}>
					Cancel
				</Button>
			</Box>
		</StyledContainer>
	);
};

export default CreateExamForm;
