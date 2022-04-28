import styled from '@emotion/styled';

const drawerWidth = 280;

export const StyledMain = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	minHeight: 'calc(100vh - 164px)',
	minWidth: 1100,
	overflow: 'auto',
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create('margin', {
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginTop: '64px',
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create('margin', {
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}));
