import { FormControl, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import Iconify from '../Iconify';

const MeetingChatWritingField = ({ sendMessage }) => {
	const [message, setMessage] = useState('');

	const submitHandler = () => {
		if (message.length > 0) {
			sendMessage(message);
			setMessage('');
		}
	};

	return (
		<FormControl
			fullWidth
			onKeyDown={(e) => {
				if (e.code === 'Enter') {
					submitHandler();
				}
			}}>
			<TextField
				autoComplete='off'
				placeholder='Type...'
				value={message}
				onChange={(e) => {
					setMessage(e.target.value);
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton
								color='primary'
								edge='end'
								sx={{ transform: 'rotate(45deg)', mr: 1, pr: 1 }}
								onClick={submitHandler}>
								<Iconify icon='eva:paper-plane-outline' />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</FormControl>
	);
};

export default MeetingChatWritingField;
