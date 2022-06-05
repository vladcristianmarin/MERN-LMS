import { useTheme } from '@emotion/react';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	List,
	Modal,
	Stack,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listExamsStudent } from '../actions/examActions';
import Iconify from '../components/Iconify';

const StudentExamsScreen = () => {
	const [open, setOpen] = useState(false);
	const [exam, setExam] = useState(null);

	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { exams } = useSelector((state) => state.examListStudent);

	useEffect(() => {
		dispatch(listExamsStudent());
	}, [dispatch]);

	const handleStartTest = () => {
		navigate(`/exams/${exam._id}`, { replace: true, state: exam });
	};

	const handleOpen = (e) => {
		setOpen(true);
		setExam(e);
	};
	const handleClose = () => {
		setOpen(false);
		setExam(null);
	};

	return (
		<>
			<Modal open={open} onClose={handleClose}>
				{exam && (
					<Card
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '60%',
							bgcolor: theme.palette.background.paper,
							boxShadow: theme.customShadows.z1,
						}}>
						<CardHeader
							title={`Are you sure you want to start ${exam?.title}?`}
							action={
								<IconButton>
									<Iconify icon='eva:close-outline' />
								</IconButton>
							}
						/>
						<CardContent>
							<Typography variant='subtitle1'>Disclaimer!</Typography>
							<Divider sx={{ my: theme.spacing(0.5) }} />
							<Typography variant='body1'>
								By clicking start button you allow access to your camera <br />
								You shall keep in mind that you are going to be recorded while taking the test <br />
								The record won't be saved but if you try to cheat at maximum 5 times you will fail automatically <br />
								After each missed step you will get a warning showing you a counter with attempts left <br />
								If that counter gets to 0 you will fail
							</Typography>
							<Divider sx={{ my: theme.spacing(0.5) }} />
							<Typography variant='subtitle1'>
								You have {exam.timer} minutes to answer {exam.questions.length} questions. <br /> Timer will start from
								the moment you press start. <br />
								Good Luck!
							</Typography>
						</CardContent>
						<Stack direction='row' gap={1.5} justifyContent='flex-end' alignItems='center' sx={{ m: theme.spacing(1) }}>
							<Button variant='contained' color='primary' onClick={handleStartTest}>
								Start
							</Button>
							<Button variant='contained' color='error' onClick={handleClose}>
								Cancel
							</Button>
						</Stack>
					</Card>
				)}
			</Modal>
			<List>
				{exams?.map((e) => (
					<Button key={e._id} onClick={handleOpen.bind(this, e)}>
						{e.title}
					</Button>
				))}
			</List>
		</>
	);
};

export default StudentExamsScreen;
