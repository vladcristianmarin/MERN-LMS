import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// material
import {
	Box,
	Checkbox,
	CardHeader,
	Typography,
	FormControlLabel,
	Stack,
	List,
	IconButton,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	FormHelperText,
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

import Iconify from '../Iconify';
import { Form, FormikProvider, useFormik } from 'formik';

function TaskItem({ task, ...other }) {
	const [checked, setChecked] = useState(task.done);
	const [display, setDisplay] = useState('flex');
	const dispatch = useDispatch();

	const checkTaskHandler = (e) => {
		setChecked(e.target.checked);
		dispatch(
			(() => async (_dispatch, getState) => {
				const {
					userLogin: { authToken },
				} = getState();
				const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

				await axios.patch('/api/tasks', { taskId: task._id, done: e.target.checked }, config);
			})()
		);
	};

	const deleteTaskHandler = () => {
		dispatch(
			(() => async (_dispatch, getState) => {
				const {
					userLogin: { authToken },
				} = getState();
				const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

				await axios.delete(`/api/tasks/${task._id}`, config);
				setDisplay('none');
			})()
		);
	};

	return (
		<Stack direction='row' justifyContent='space-between' sx={{ py: 0.75, display }}>
			<FormControlLabel
				control={<Checkbox value={task.task} checked={checked} {...other} onChange={checkTaskHandler} />}
				label={
					<Typography
						variant='body1'
						sx={{
							...(checked && {
								color: 'text.disabled',
								textDecoration: 'line-through',
							}),
						}}>
						{task.task}
					</Typography>
				}
			/>
			{checked && (
				<IconButton color='error' onClick={deleteTaskHandler}>
					<Iconify icon='eva:trash-outline' />
				</IconButton>
			)}
		</Stack>
	);
}

const TasksList = ({ createdTask }) => {
	const [tasks, setTasks] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (createdTask) {
			setTasks((prev) => [...prev, createdTask]);
		}
	}, [createdTask]);

	useEffect(() => {
		dispatch(
			(() => async (_dispatch, getState) => {
				const {
					userLogin: { authToken },
				} = getState();
				const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

				const { data } = await axios.get('/api/tasks', config);
				if (data.length !== 0) {
					setTasks(data);
				}
			})()
		);
	}, [dispatch]);

	return (
		<List sx={{ height: '360px', overflow: 'auto', my: 2 }}>
			{tasks.length === 0 && <Typography variant='body1'>Add your first task!</Typography>}
			{tasks.map((task) => (
				<TaskItem key={task._id} task={task} />
			))}
		</List>
	);
};

const TasksForm = () => {
	const [createdTask, setCreatedTask] = useState(null);
	const dispatch = useDispatch();

	const TaskSchema = Yup.object().shape({
		task: Yup.string().min(3).required('Task is required'),
	});

	const formik = useFormik({
		initialValues: { task: '' },
		validationSchema: TaskSchema,
		onSubmit(values) {
			dispatch(
				(() => async (_dispatch, getState) => {
					const {
						userLogin: { authToken },
					} = getState();
					const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` } };

					const { data } = await axios.put('/api/tasks', { task: values.task }, config);
					if (data) {
						setCreatedTask(data);
					}
				})()
			);
			handleReset();
		},
	});

	const { setFieldValue, handleSubmit, values, handleReset, getFieldProps, errors, touched } = formik;

	return (
		<Box sx={{ height: '100%' }}>
			<CardHeader title='Tasks' />
			<FormikProvider value={formik}>
				<Form
					autoComplete='off'
					autoCapitalize='on'
					noValidate
					onSubmit={handleSubmit}
					style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<FormControl
						sx={{ mx: 2, mt: 2 }}
						variant='outlined'
						{...getFieldProps('task')}
						error={Boolean(touched.task && errors.task)}>
						<InputLabel htmlFor='outlined-adornment-task'>Task</InputLabel>
						<OutlinedInput
							id='outlined-adornment-task'
							type='text'
							value={values.task}
							onChange={(e) => setFieldValue('task', e.target.value)}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton color='primary' onClick={handleSubmit} edge='end' sx={{ mr: 0.1 }}>
										<Iconify icon='eva:save-outline' />
									</IconButton>
									<IconButton color='error' onClick={handleReset} edge='end'>
										<Iconify icon='eva:close-outline' />
									</IconButton>
								</InputAdornment>
							}
							label='Task'
						/>
						{Boolean(touched.task && errors.task) && <FormHelperText>{touched.task && errors.task}</FormHelperText>}
					</FormControl>
				</Form>
			</FormikProvider>
			<Box sx={{ px: 3 }}>
				<TasksList createdTask={createdTask} />
			</Box>
		</Box>
	);
};

export default TasksForm;
