import React from 'react';
import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
	Input,
	Slide,
	Button,
	IconButton,
	InputAdornment,
	ClickAwayListener,
} from '@mui/material';
import Iconify from './Iconify';

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
	top: 0,
	left: 0,
	zIndex: 99,
	width: '100%',
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	height: APPBAR_MOBILE,
	backdropFilter: 'blur(6px)',
	WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
	padding: theme.spacing(0, 3),
	boxShadow: theme.customShadows.z8,
	backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
	[theme.breakpoints.up('md')]: {
		height: APPBAR_DESKTOP,
		padding: theme.spacing(0, 5),
	},
}));

const SearchBar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const openSearchBarHandler = () => {
		setIsOpen((prev) => !prev.isOpen);
	};

	return (
		<ClickAwayListener onClickAway={() => setIsOpen(false)}>
			<div>
				{!isOpen && (
					<IconButton onClick={openSearchBarHandler}>
						<Iconify
							icon='eva:search-fill'
							sx={{ color: 'primary.main', height: '25', width: '25' }}
						/>
					</IconButton>
				)}

				<Slide direction='down' in={isOpen} mouseonenter='true' unmountOnExit>
					<SearchbarStyle>
						<Input
							autoFocus
							fullWidth
							disableUnderline
							placeholder='Search...'
							sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
							startAdornment={
								<InputAdornment position='start'>
									<Iconify
										icon='eva:search-fill'
										sx={{
											color: 'text.disabled',
											width: 25,
											height: 25,
										}}
									/>
								</InputAdornment>
							}
						/>
						<Button variant='contained' onClick={() => setIsOpen(false)}>
							Search
						</Button>
					</SearchbarStyle>
				</Slide>
			</div>
		</ClickAwayListener>
	);
};

export default SearchBar;
