import styled from '@emotion/styled';
import { Card } from '@mui/material';

const ModalBox = styled(Card)(({ theme }) => ({
	display: 'flex',
	minWidth: theme.spacing(40),
	flexDirection: 'column',
	alignItems: 'center',
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	padding: theme.spacing(3),
}));

export default ModalBox;
