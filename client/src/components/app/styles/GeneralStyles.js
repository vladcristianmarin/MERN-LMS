import styled from '@emotion/styled';
import { Card } from '@mui/material';

export const RootStyle = styled('div')(({ theme }) => ({
	[theme.breakpoints.up('md')]: { display: 'flex' },
}));

export const HeaderStyle = styled('header')(({ theme, sx }) => ({
	top: 0,
	zIndex: 9,
	lineHeight: 0,
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	position: 'absolute',
	padding: theme.spacing(1.5),
	justifyContent: 'space-between',
	[theme.breakpoints.up('md')]: {
		alignItems: 'flex-start',
		padding: theme.spacing(7, 5, 0, 7),
	},
	...sx,
}));

export const SectionStyle = styled(Card)(({ theme, sx }) => ({
	width: '100%',
	maxWidth: 464,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	margin: theme.spacing(2, 0, 2, 2),
	...sx,
}));

export const ContentStyle = styled('div')(({ theme, sx }) => ({
	maxWidth: 480,
	margin: 'auto',
	display: 'flex',
	minHeight: '100vh',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: theme.spacing(12, 0),
	...sx,
}));
