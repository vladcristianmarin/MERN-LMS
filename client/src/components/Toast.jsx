import { Alert, Collapse, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Iconify from './Iconify';

const Toast = ({ show, timeout, severity, onClose, message }) => {
	return ReactDOM.createPortal(
		<Box
			sx={{
				width: '30%',
				p: 3,
				position: 'fixed',
				top: 0,
				right: 0,
				textAlign: 'right',
				zIndex: 1200,
			}}>
			<Collapse in={show} timeout={timeout}>
				<Alert
					severity={severity}
					action={
						<IconButton color='inherit' size='small' onClick={onClose}>
							<Iconify icon='eva:close-outline' />
						</IconButton>
					}>
					{message}
				</Alert>
			</Collapse>
		</Box>,
		document.getElementById('alert')
	);
};

export default Toast;
