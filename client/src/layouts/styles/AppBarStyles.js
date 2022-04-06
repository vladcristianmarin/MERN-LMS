import styled from '@emotion/styled';
import { alpha, AppBar } from '@mui/material';

const drawerWidth = 280;

export const StyledAppBar = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	color: theme.palette.primary.main,
	backgroundColor: alpha(theme.palette.background.default, 0.87),
	transition: theme.transitions.create(['margin', 'width'], {
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));
