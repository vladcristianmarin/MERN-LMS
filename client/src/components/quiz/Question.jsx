import { Typography } from '@mui/material';
import React from 'react';
import Transitions from '../../utils/transitions';

const Question = ({ questionIndex, nbOfQuestions, question }) => {
	return (
		<Transitions>
			<>
				<Typography variant='body1'>{`Question ${questionIndex + 1}/${nbOfQuestions}:`} </Typography>
				<Typography variant='h4'>{question}</Typography>
				<Typography variant='caption'>(select one ore many)</Typography>
			</>
		</Transitions>
	);
};

export default Question;
