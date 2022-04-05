import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { enrollCourse } from '../../actions/groupActions';

const EnrollCourseForm = ({ open, handleClose, group }) => {
	const dispatch = useDispatch();

	const courseList = useSelector((state) => state.courseList);
	const courses = courseList.courses || [];

	const groupEnrollCourse = useSelector((state) => state.groupEnrollCourse);
	const { loading, success } = groupEnrollCourse;

	const AddCourseSchema = Yup.object().shape({
		course: Yup.string().required('Please select a course!'),
	});

	const formik = useFormik({
		initialValues: {
			course: '',
		},
		validationSchema: AddCourseSchema,
		onSubmit(values) {
			const { course } = values;
			dispatch(enrollCourse(group._id, course));
		},
	});

	const { errors, touched, setFieldValue, isSubmitting, setSubmitting, handleSubmit, handleReset, getFieldProps } =
		formik;

	useEffect(() => {
		if (!loading) {
			setSubmitting(false);
		}
		if (success) {
			handleReset();
			handleClose();
		}
		// eslint-disable-next-line
	}, [loading, success]);

	const closeFormHandler = () => {
		handleClose();
		handleReset();
	};

	const options = courses.map((course) => ({
		label: `${course.name} - ${course.teacher.name} (${course.teacher.email})`,
		id: course._id,
	}));

	return (
		<Dialog keepMounted key={open} open={open} onClose={handleClose} aria-labelledby='dialog-title'>
			<DialogTitle id='dialog-title'>Enroll group in a course</DialogTitle>
			<DialogContent>
				<FormikProvider value={formik}>
					<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
						<Autocomplete
							key={loading}
							sx={{ py: 1, minWidth: 400 }}
							id='teachers'
							options={options}
							isOptionEqualToValue={(obj1, obj2) => obj1.id === obj2.id}
							onChange={(_e, value, reason) => {
								if (reason === 'clear') {
									setFieldValue('course', '');
								} else {
									setFieldValue('course', value.id);
								}
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Course'
									{...getFieldProps('course')}
									error={Boolean(touched.course && errors.course)}
									helperText={touched.course && errors.course}
								/>
							)}
						/>
					</Form>
				</FormikProvider>
			</DialogContent>
			<DialogActions>
				<LoadingButton type='submit' loading={isSubmitting} onClick={handleSubmit}>
					Enroll
				</LoadingButton>
				<Button color='error' onClick={closeFormHandler}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EnrollCourseForm;
