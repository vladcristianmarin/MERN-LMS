import React from 'react';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';

const ConfirmDialog = ({ open, handleClose, title, message = 'Are you sure?', loading = false, handleConfirm }) => {
	const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction='down' ref={ref} {...props} />;
	});
	return (
		<Dialog
			disableScrollLock
			keepMounted
			scroll='body'
			key={open}
			open={open}
			TransitionComponent={loading ? undefined : Transition}
			onClose={handleClose}
			aria-labelledby='dialog-title'
			aria-describedby='dialog-text'>
			<DialogTitle id='dialog-title'>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id='dialog-text'>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<LoadingButton loading={loading} onClick={handleConfirm}>
					Confirm
				</LoadingButton>
				<Button color='error' onClick={handleClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConfirmDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	title: PropTypes.string,
	message: PropTypes.string,
	handleConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
