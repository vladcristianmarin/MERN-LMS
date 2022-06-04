import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Transitions from '../../utils/transitions';

const Result = ({ result, nbOfQuestions }) => {
	const [src, setSrc] = useState(null);

	useEffect(() => {
		if (result) {
			setSrc(result.score >= 50 ? '/images/illustration_exam_success.svg' : '/images/illustration_exam_fail.svg');
		}
	}, [result]);
	return (
		<Transitions>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					userSelect: 'none',
					display: 'flex',
					transform: 'translateY(-10%)',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: '20px',
					}}>
					<Box component='img' src={src} alt='Result' sx={{ height: '50%', width: '50%' }} />
					<Typography variant='h4'>{`${result.answers} / ${nbOfQuestions} Questions. Score: ${result.score} / 100`}</Typography>
					<Button to='/' size='large' variant='primary' component={Link}>
						&larr; Go to Home
					</Button>
				</Box>
			</Box>
		</Transitions>
	);
};

export default Result;
