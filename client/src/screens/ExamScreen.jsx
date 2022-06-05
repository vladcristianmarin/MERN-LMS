import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Iconify from '../components/Iconify';
import Answer from '../components/quiz/Answer';
import Question from '../components/quiz/Question';
import Result from '../components/quiz/Result';
import Transitions from '../utils/transitions';

const StyledPaper = styled(Paper)(({ theme }) => ({
	position: 'relative',
	userSelect: 'none',
	overflowX: 'hidden',
	...theme.mixins.gutters,
	padding: theme.spacing(3),
	width: '70%',
	height: '95%',
	margin: '0 auto',
	boxShadow: `${theme.customShadows.z1}, ${theme.customShadows.z8}`,
}));

const ExamScreen = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [currentAnswers, setCurrentAnswers] = useState([]);
	const [questions, setQuestions] = useState([]);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [finalAnswers, setFinalAnswers] = useState({});
	const [nbOfQuestions, setNbOfQuestions] = useState(0);
	const [result, setResult] = useState(null);

	const [videoStream, setVideoStream] = useState(null);

	const [submitted, setSubmitted] = useState(false);

	const [shouldShowNext, setShouldShowNext] = useState(false);

	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const getPermissions = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				setVideoStream(stream);
				return stream;
			} catch (e) {
				navigate('/', { replace: true });
				return null;
			}
		};
		const result = Promise.all([]).then(getPermissions);

		return () => {
			result.then((stream) => {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			});
		};
	}, [navigate]);

	useEffect(() => {
		if (submitted && Object.keys(finalAnswers).length === questions.length) {
			setQuestions([]);
			setCurrentQuestionIndex(0);
			console.log(finalAnswers);
		}
	}, [submitted, finalAnswers, questions]);

	let lastTimeButtonClicked = new Date().getTime();

	useEffect(() => {
		setQuestions(location.state.questions);
		setNbOfQuestions(location.state.questions.length);
	}, [location]);

	useEffect(() => {
		if (questions.length > 0) {
			setCurrentAnswers(questions[currentQuestionIndex].answers);
		}
	}, [questions, currentQuestionIndex]);

	const onNextClick = () => {
		setSelectedAnswers([]);
		setFinalAnswers((prev) => {
			prev[questions[currentQuestionIndex]._id] = selectedAnswers;
			return prev;
		});

		setShouldShowNext(false);
		if (currentQuestionIndex === questions.length - 1 || areButtonsAnimating()) {
			return;
		}
		updatePage(currentQuestionIndex + 1);
	};

	const onSubmitClick = async () => {
		setSelectedAnswers([]);
		setFinalAnswers((prev) => {
			prev[questions[currentQuestionIndex]._id] = selectedAnswers;
			return prev;
		});
		setSubmitted(true);
		//fetchResult
		setResult({ answers: 3, score: 100 });
		const tracks = videoStream.getTracks();
		tracks.forEach((track) => track.stop());
	};

	const onAnswerSelected = (answerId) => {
		setShouldShowNext(true);
		setSelectedAnswers((selected) => [...selected, answerId]);
	};

	const onAnswerUnselected = (answerId) => {
		if (selectedAnswers.length === 1) {
			setShouldShowNext(false);
		}
		setSelectedAnswers((selected) => {
			return selected.filter((s) => s !== answerId);
		});
	};

	const updatePage = (questionIndex) => {
		lastTimeButtonClicked = new Date().getTime();
		document.getElementById('mainContainer').scrollTop = 0;
		setCurrentQuestionIndex(questionIndex);
	};

	const questionsLoaded = () => (questions.length !== 0 ? true : false);
	const getCurrentQuestion = () => questions[currentQuestionIndex].question;

	const shouldShowSubmit = () =>
		currentQuestionIndex === questions.length - 1 && selectedAnswers && Object.keys(selectedAnswers).length !== 0;
	const areButtonsAnimating = () => {
		const transitionTime = 600;
		const currentTime = new Date().getTime();

		return currentTime - transitionTime <= lastTimeButtonClicked;
	};

	return (
		<Transitions>
			<StyledPaper id='mainContainer' elevation={2}>
				{result === null && (
					<Typography
						variant='subtitle2'
						sx={{
							display: 'flex',
							alignItems: 'center',
							mb: theme.spacing(1),
						}}>
						<Iconify icon='carbon:dot-mark' sx={{ fontSize: '20px', color: theme.palette.primary.main }} />
						<Iconify
							icon='eva:video-outline'
							sx={{ fontSize: '20px', mr: theme.spacing(1), color: theme.palette.text.primary }}
						/>
						Don't cheat! You are being recorded!
					</Typography>
				)}
				{questionsLoaded() && result === null ? (
					<Transitions>
						<>
							<Question
								questionIndex={currentQuestionIndex}
								nbOfQuestions={nbOfQuestions}
								question={getCurrentQuestion()}
							/>
							<>
								{currentAnswers.map((currentAnswer, index) => (
									<Answer
										answerIndex={index}
										key={currentAnswer._id}
										answer={currentAnswer}
										onAnswerSelect={onAnswerSelected}
										onAnswerUnselect={onAnswerUnselected}
									/>
								))}
							</>
							<Box id='buttonsContainer' sx={{ position: 'absolute', bottom: '5%', right: '2.5%' }}>
								{shouldShowSubmit() ? (
									<Transitions>
										<Button variant='contained' onClick={onSubmitClick} color='warning'>
											Submit
										</Button>
									</Transitions>
								) : null}

								{shouldShowNext && !shouldShowSubmit() ? (
									<Transitions>
										<Button variant='contained' onClick={onNextClick} color='primary'>
											Next
										</Button>
									</Transitions>
								) : null}
							</Box>
						</>
					</Transitions>
				) : result !== null ? (
					<Result result={result} nbOfQuestions={nbOfQuestions} />
				) : (
					<CircularProgress />
				)}
			</StyledPaper>
		</Transitions>
	);
};

export default ExamScreen;
