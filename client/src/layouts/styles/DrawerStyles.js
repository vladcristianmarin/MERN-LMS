import styled from '@emotion/styled';
import { DialogTitle, Drawer } from '@mui/material';

const drawerWidth = 280;

export const StyledDrawer = styled(Drawer)(({ _theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		boxSizing: 'border-box',
	},
}));

export const StyledDrawerHeader = styled('div')(({ theme }) => ({
	position: 'fixed',
	width: drawerWidth,
	boxShadow: theme.customShadows.z1,
	background: theme.palette.background.default,
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	justifyContent: 'space-between',
	minHeight: '64px',
	zIndex: 9999,
}));

export const StyledDrawerAccount = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginTop: theme.spacing(12),
	padding: theme.spacing(2, 2.5),
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	backgroundColor: theme.palette.grey[500_12],
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
	position: 'absolute',
	right: 0,
	transform: 'translate(20%, 15%)',
}));
