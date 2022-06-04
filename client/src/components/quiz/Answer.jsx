import React, { useEffect, useRef, useState } from 'react';

import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@emotion/react';

const Answer = ({ onAnswerSelect, onAnswerUnselect, answerIndex, answer }) => {
	const theme = useTheme();
	const [checked, setChecked] = useState(false);

	const onAnswerClick = (e) => {
		setChecked((prev) => !prev);
		e.target.checked ? onAnswerSelect(answerIndex) : onAnswerUnselect(answerIndex);
	};

	return (
		<Box sx={{ margin: theme.spacing(1.5, 0.5, 0.5, 1), userSelect: 'none' }}>
			<FormControlLabel
				checked={checked}
				label={answer.answer}
				control={<Checkbox checked={checked} onChange={onAnswerClick} />}
			/>
		</Box>
	);
};

export default Answer;
