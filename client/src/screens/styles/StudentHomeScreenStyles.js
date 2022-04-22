import styled from '@emotion/styled';
import { Avatar, Card, Container } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '0.7fr 1fr',
	gridTemplateRows: 'repeat(2, auto)',
	gap: theme.spacing(1),
}));

export const StyledRightCard = styled(Card)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '0.8fr 1fr',
	gridTemplateRows: '1fr 0.8fr',
	gap: theme.spacing(2),
	padding: theme.spacing(2),
	background: theme.palette.background.neutral,
}));

export const StyledRightChildrenCard = styled(Card)(({ _theme, sx }) => ({
	transition: 'all 0.3s',
	'&:hover': {
		transform: 'translateY(-4px)',
	},
	...sx,
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
	top: '85%',
	left: '10%',
	position: 'absolute',
	background: theme.palette.primary.dark,
	boxShadow: `0 0 0 7px ${theme.palette.background.paper}`,
	borderRadius: '16px',
	width: 56,
	height: 56,
}));
