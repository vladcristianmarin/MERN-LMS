import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

const Toast = ({ show, timeout, severity, onClose, message }) => {
	return ReactDOM.createPortal(
		<Snackbar
			anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
			open={show}
			autoHideDuration={timeout}
			onClose={onClose}>
			<Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
				{message}
			</Alert>
		</Snackbar>,
		document.getElementById('alert')
	);
};

export default Toast;
