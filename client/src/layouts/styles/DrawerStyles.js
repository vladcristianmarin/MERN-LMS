import styled from '@emotion/styled';
import { DialogTitle, Drawer } from '@mui/material';

const drawerWidth = 280;

export const StyledDrawer = styled(Drawer)(() => ({
	width: drawerWidth,
	flexShrink: 0,
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		boxSizing: 'border-box',
	},
}));

export const StyledDrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	justifyContent: 'space-between',
	minHeight: '64px',
}));

export const StyledDrawerAccount = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2, 2.5),
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	backgroundColor: theme.palette.grey[500_12],
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
	position: 'absolute',
	right: 0,
	transform: 'translate(20%, 15%)',
}));
