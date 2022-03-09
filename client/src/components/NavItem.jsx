import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import {
	Box,
	List,
	Collapse,
	ListItemText,
	ListItemIcon,
	ListItemButton,
} from '@mui/material';
import Iconify from './Iconify';

const NavItem = ({ item, active }) => {
	const { title, path, icon, info, children } = item;
	const isActive = active(path);
	const [isOpen, setIsOpen] = useState(isActive);
	const theme = useTheme();

	const ListItemStyle = styled((props) => (
		<ListItemButton disableGutters {...props} />
	))(({ theme }) => ({
		...theme.typography.subtitle2,
		height: 48,
		position: 'relative',
		textTransform: 'capitalize',
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(2.5),
		paddingTop: theme.spacing(4.5),
		paddingBottom: theme.spacing(4.5),
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		color: theme.palette.text.secondary,
		'&:before': {
			top: 0,
			right: 0,
			width: 3,
			bottom: 0,
			content: "''",
			display: 'none',
			position: 'absolute',
			borderTopLeftRadius: 4,
			borderBottomLeftRadius: 4,
			backgroundColor: theme.palette.primary.main,
		},
	}));

	const ListItemIconStyle = styled(ListItemIcon)({
		width: 23,
		height: 23,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	});

	const openItemHandler = () => {
		setIsOpen((prev) => !prev.isOpen);
	};

	const activeRootStyle = {
		color: 'primary.main',
		fontWeight: 'fontWeightNormal',
		bgcolor: alpha(
			theme.palette.primary.main,
			theme.palette.action.selectedOpacity
		),
		'&:before': { display: 'block' },
	};

	const activeSubStyle = {
		color: 'text.primary',
		fontWeight: 'fontWeightNormal',
	};

	if (children) {
		return (
			<>
				<ListItemStyle
					onClick={openItemHandler}
					sx={{
						...(isActive && activeRootStyle),
					}}>
					<ListItemIconStyle>{icon && icon}</ListItemIconStyle>
					<ListItemText disableTypography primary={title} />
					{info && info}
					<Iconify
						icon={
							isOpen
								? 'eva:arrow-ios-downward-fill'
								: 'eva:arrow-ios-forward-fill'
						}
						sx={{ width: 16, height: 16, ml: 1 }}
					/>
				</ListItemStyle>

				<Collapse in={isOpen} timeout='auto' unmountOnExit>
					<List component='div'>
						{children.map((item) => {
							const { title, path } = item;
							const isActiveSub = active(path);

							return (
								<ListItemStyle
									key={title}
									component={RouterLink}
									to={path}
									sx={{
										...(isActiveSub && activeSubStyle),
									}}>
									<ListItemIconStyle>
										<Box
											component='span'
											sx={{
												width: 4,
												height: 4,
												display: 'flex',
												borderRadius: '50%',
												alignItems: 'center',
												justifyContent: 'center',
												bgcolor: 'text.disabled',
												transition: (theme) =>
													theme.transitions.create('transform'),
												...(isActiveSub && {
													transform: 'scale(2)',
													bgcolor: 'primary.main',
												}),
											}}
										/>
									</ListItemIconStyle>
									<ListItemText primary={title} />
								</ListItemStyle>
							);
						})}
					</List>
				</Collapse>
			</>
		);
	}

	return (
		<ListItemStyle
			component={RouterLink}
			to={path}
			sx={{
				...(isActive && activeRootStyle),
			}}>
			<ListItemIconStyle>{icon && icon}</ListItemIconStyle>
			<ListItemText disableTypography primary={title} />
			{info && info}
		</ListItemStyle>
	);
};

NavItem.propTypes = {
	item: PropTypes.object,
	active: PropTypes.func,
};

export default NavItem;
