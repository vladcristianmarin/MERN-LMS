import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import {
	Autocomplete,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { listStudents } from '../../actions/studentActions';
import Toast from '../Toast';

const AddStudentsForm = ({ open, handleClose, group }) => {
	const dispatch = useDispatch();

	const studentList = useSelector((state) => state.studentList);
	const students = studentList.students || [];

	const studentsEmails = students.map((student) => student.email);

	// const groupAddStudents = useSelector((state) => state.groupAddStudents);
	// const { error, loading, success } = groupAddStudents;

	const error = false;
	const loading = false;
	const success = false;

	const AddStudentsSchema = Yup.object().shape({
		students: Yup.array().of(Yup.string()).min(1, 'At least 1 email is required!'),
	});

	const formik = useFormik({
		initialValues: {
			students: [],
		},
		validationSchema: AddStudentsSchema,
		onSubmit(values) {
			const { students } = values;
			// dispatch(addStudents(students));
		},
	});

	const { errors, touched, values, setFieldValue, isSubmitting, setSubmitting, handleSubmit, handleReset } = formik;

	useEffect(() => {
		dispatch(listStudents());
	}, [dispatch]);

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (success) {
			handleReset();
		}
		// eslint-disable-next-line
	}, [loading, success]);

	const closeFormHandler = () => {
		handleClose();
		handleReset();
	};

	return (
		<Dialog
			disableScrollLock
			keepMounted
			scroll='body'
			key={open}
			open={open}
			onClose={handleClose}
			aria-labelledby='dialog-title'>
			<DialogTitle id='dialog-title'>Add Students To Group {group?.name}</DialogTitle>
			<DialogContent>
				<FormikProvider value={formik}>
					<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
						<Autocomplete
							sx={{ py: 1, minWidth: 400 }}
							key={loading}
							multiple
							id='tags-filled'
							value={values.students}
							freeSolo
							options={studentsEmails}
							onChange={(_e, val) => setFieldValue('students', val)}
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
					</Form>
				</FormikProvider>
			</DialogContent>
			<DialogActions>
				<LoadingButton type='submit' loading={isSubmitting} onClick={handleSubmit}>
					Submit
				</LoadingButton>
				<Button color='error' onClick={closeFormHandler}>
					Cancel
				</Button>
			</DialogActions>
			<Toast show={error && !loading} timeout={3000} severity='error' message={error} onClose={() => {}} />
			<Toast
				show={success && !loading}
				timeout={2000}
				severity='success'
				message='Students added!'
				onClose={() => {}}
			/>
		</Dialog>
	);
};

export default AddStudentsForm;
