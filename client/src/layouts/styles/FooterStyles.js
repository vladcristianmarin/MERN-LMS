import styled from '@emotion/styled';

const drawerWidth = 280;

export const FooterStyles = styled('footer')(({ theme, open }) => {
	return {
		gridColumn: '1/-1',
		display: 'flex',
		justifyContent: 'center',
		paddingTop: theme.spacing(5),
		paddingBottom: theme.spacing(5),
		margin: 0,
		boxShadow: theme.shadows[20],
		transition: theme.transitions.create(['margin', 'width'], {
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			marginLeft: `${drawerWidth}px`,
			transition: theme.transitions.create(['margin'], {
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	};
});
