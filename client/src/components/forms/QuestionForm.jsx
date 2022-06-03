import * as Yup from 'yup';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	FormControlLabel,
	IconButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Iconify from '../Iconify';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';

const Answer = forwardRef(({ id, addAnswer, saveAnswer }, ref) => {
	const theme = useTheme();
	const [disabled, setDisabled] = useState(false);
	const [correct, setCorrect] = useState(false);
	const [answer, setAnswer] = useState('');
	const [saved, setSaved] = useState(false);

	useImperativeHandle(ref, () => ({
		correct,
		answer,
		disable() {
			setDisabled(true);
		},
	}));

	const submitHandler = () => {
		addAnswer();
		saveAnswer({ id, correct, answer });
		setSaved(true);
	};

	let display = 'flex';

	if (!saved && disabled) {
		display = 'none';
	}

	return (
		<Box
			sx={{
				border: 'solid 1px rgba(0, 0, 0, 0.15)',
				borderRadius: '12px',
				px: theme.spacing(1),
				pb: theme.spacing(1),
				display: display,
				flexDirection: 'column',
				gap: theme.spacing(0.2),
			}}
			id={id}
			key={id}>
			<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ pl: theme.spacing(2) }}>
				<Typography variant='body1' color={disabled ? 'text.disabled' : 'inherit'}>{`Answer ${id}`}</Typography>
				<FormControlLabel
					disabled={disabled}
					value={correct}
					control={<Checkbox onChange={(e) => setCorrect(e.target.checked)} />}
					label='correct'
					labelPlacement='end'
				/>
			</Stack>
			<TextField
				disabled={disabled}
				aria-disabled={disabled}
				value={answer}
				fullWidth
				color='primary'
				type='text'
				label='Type answer'
				onChange={(e) => setAnswer(e.target.value)}
			/>
			<IconButton color='inherit' sx={{ alignSelf: 'flex-end' }} onClick={submitHandler} disabled={disabled}>
				<Iconify icon='eva:checkmark-outline' />
			</IconButton>
		</Box>
	);
});

const QuestionForm = ({ id, removeQuestion, addQuestion, saveQuestion }) => {
	const [saved, setSaved] = useState(false);
	const [header, setHeader] = useState('New Question');
	const [refs, setRefs] = useState([useRef()]);

	const addAnswerHandler = () => {
		const ref = createRef();
		setRefs((prev) => [...prev, ref]);
		setAnswers((prev) => [
			...prev,
			<Answer
				key={prev.length + 1}
				id={prev.length + 1}
				ref={ref}
				addAnswer={addAnswerHandler}
				saveAnswer={saveAnswerHandler}
			/>,
		]);
	};

	const saveAnswerHandler = (answer) => {
		setSavedAnswers((prev) => [...prev, answer]);
	};

	const [answers, setAnswers] = useState([
		<Answer key={1} id={1} ref={refs[0]} addAnswer={addAnswerHandler} saveAnswer={saveAnswerHandler} />,
	]);
	const [savedAnswers, setSavedAnswers] = useState([]);

	const theme = useTheme();

	const QuestionSchema = Yup.object().shape({
		question: Yup.string().required('Question is required'),
		answers: Yup.array().min(1),
	});

	const formik = useFormik({
		initialValues: { question: '', answers: [] },
		validationSchema: QuestionSchema,
		onSubmit(values) {
			const { question, answers } = values;
			setHeader(question);
			setSaved(true);
			addQuestion();
			saveQuestion({ question, answers });
		},
	});

	const { errors, touched, setFieldValue, handleSubmit, getFieldProps } = formik;

	useEffect(() => {
		if (saved) {
			answers.forEach((a) => a.ref.current.disable());
		}
	}, [saved, answers]);

	useEffect(() => {
		setFieldValue('answers', savedAnswers);
	}, [setFieldValue, savedAnswers]);

	return (
		<Card sx={{ border: 'solid 1px rgba(0, 0, 0, 0.15)' }}>
			<CardHeader
				title={header}
				action={
					<IconButton onClick={removeQuestion.bind(this, id)} color='error'>
						<Iconify icon='eva:close-circle-outline' />
					</IconButton>
				}
			/>
			<CardContent>
				<FormikProvider value={formik}>
					<Form
						autoComplete='off'
						autoCapitalize='on'
						noValidate
						onSubmit={handleSubmit}
						disabled={saved}
						style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
						<TextField
							disabled={saved}
							aria-disabled={saved}
							fullWidth
							color='primary'
							type='text'
							label='Question'
							{...getFieldProps('question')}
							error={Boolean(touched.question && errors.question)}
							helperText={touched.question && errors.question}
						/>
						<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing(2) }}>{answers}</Box>
						{Boolean(touched.answers && errors.answers) && (
							<Typography variant='body2' color='error'>
								Question should have at least one answer!
							</Typography>
						)}
						<Button
							type='submit'
							variant='contained'
							color='warning'
							sx={{ ml: 'auto', bgcolor: '#fab005', color: '#fff' }}>
							Save answer
						</Button>
					</Form>
				</FormikProvider>
			</CardContent>
		</Card>
	);
};

export default QuestionForm;
