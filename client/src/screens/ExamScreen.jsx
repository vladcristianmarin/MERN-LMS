import * as facemesh from '@tensorflow-models/face-landmarks-detection';

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
import Toast from '../components/Toast';

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
	const [audio] = useState(new Audio('http://thecyberbuddy.com/sounds/urgent.wav'));

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [currentAnswers, setCurrentAnswers] = useState([]);
	const [questions, setQuestions] = useState([]);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [finalAnswers, setFinalAnswers] = useState({});
	const [nbOfQuestions, setNbOfQuestions] = useState(0);
	const [result, setResult] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [shouldShowNext, setShouldShowNext] = useState(false);
	const [video, setVideo] = useState(null);

	const [showAlert, setShowAlert] = useState(false);
	const [alertCounter, setAlertCounter] = useState(false);

	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const getPermissions = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				const video = document.createElement('video');
				video.srcObject = stream;
				video.width = 640;
				video.height = 480;
				video.muted = true;
				video.onloadeddata = (e) => {
					setVideo(e.target);
					video.play();
				};
				return stream;
			} catch (e) {
				console.log(e);
				navigate('/', { replace: true });
				return null;
			}
		};

		const result = getPermissions();

		return () => {
			result.then((stream) => {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			});
		};
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (video !== null) {
			const runFacemesh = async () => {
				const model = facemesh.SupportedModels.MediaPipeFaceMesh;
				const detectorConfig = {
					runtime: 'mediapipe',
					solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
				};
				const detector = await facemesh.createDetector(model, detectorConfig);
				let leftCounter = 0;
				let rightCounter = 0;
				let upCounter = 0;
				let downCounter = 0;
				const interval = setInterval(async () => {
					const face = await detector.estimateFaces(video);
					face[0].keypoints.forEach((point) => {
						if (point.name === 'leftEye') {
							if (point.x > 430) {
								console.log('You might be looking left');
								leftCounter++;
							}
							if (point.x < 255) {
								console.log('You might be looking right');
								rightCounter++;
							}
							if (point.y < 190) {
								console.log('You might be looking up');
								upCounter++;
							}
							if (point.y > 270) {
								console.log('You might be looking down');
								downCounter++;
							}
						}
						if (point.name === 'rightEye') {
							if (point.x > 320) {
								console.log('You might be looking left');
								leftCounter++;
							}
							if (point.x < 235) {
								console.log('You might be looking right');
								rightCounter++;
							}
							if (point.y < 190) {
								console.log('You might be looking up');
								upCounter++;
							}
							if (point.y > 270) {
								console.log('You might be looking down');
								downCounter++;
							}
						}
					});

					if (leftCounter > 400 || rightCounter > 250 || upCounter > 400 || downCounter > 400) {
						setShowAlert(true);
						leftCounter = 0;
						rightCounter = 0;
						upCounter = 0;
						downCounter = 0;
					}
				}, 100);
				return interval;
			};
			const promise = runFacemesh();
			return () => {
				promise.then((interval) => clearInterval(interval));
			};
		}
	}, [video]);

	useEffect(() => {
		if (showAlert) {
			audio.play();
			setAlertCounter((prev) => ++prev);
		}
	}, [showAlert, audio]);

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
		const tracks = video.srcObject.getTracks();
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
				<Toast
					show={showAlert}
					timeout={4000}
					severity='error'
					message={`Look in your monitor! Attempts left ${10 - alertCounter}`}
					onClose={() => setShowAlert(false)}
				/>
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
