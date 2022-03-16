import PropTypes from 'prop-types';
import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Stack,
	Typography,
	Link as MUILink,
	ListItem,
} from '@mui/material';
import randomColor from '../utils/randomColor';
import Iconify from '../components/Iconify';
import { useTheme } from '@emotion/react';
import { Link } from 'react-router-dom';

const CourseListItem = ({
	avatarText,
	title,
	prof,
	when,
	inCall = false,
	id,
}) => {
	const theme = useTheme();

	return (
		<ListItem
			sx={{
				borderRadius: '16px',
				display: 'grid',
				gridTemplateColumns: '0.2fr 3fr  1fr 2fr',
				alignContent: 'top',
				gap: 2,
				boxShadow: theme.shadows[3],
				my: 2,
			}}>
			<Avatar
				sx={{
					bgcolor: randomColor(),
					height: 64,
					width: 64,
				}}>
				<Typography variant='subtitle1'>{avatarText}</Typography>
			</Avatar>

			<Box sx={{ ml: 2 }}>
				<MUILink
					component={Link}
					variant='h4'
					color='text.primary'
					to={`/courses/${id}`}
					underline='hover'>
					{title}
				</MUILink>

				<Typography variant='body2' color='text.secondary'>
					{prof}
				</Typography>
			</Box>

			<Typography variant='body1'>{when}</Typography>

			<Stack direction='row' spacing={1.5} sx={{ ml: 'auto' }}>
				{inCall && (
					<Button color='secondary' variant='contained' size='large'>
						<Iconify
							sx={{ width: 24, height: 24, mr: 0.5 }}
							icon='eva:headphones-outline'
						/>
						Join Call
					</Button>
				)}
				<Button color='primary' variant='contained' size='large'>
					<Iconify
						sx={{ width: 24, height: 24, mr: 0.5 }}
						icon='eva:eye-outline'
					/>
					<MUILink
						component={Link}
						sx={{ color: 'inherit' }}
						to={`/courses/${id}`}
						underline='none'>
						View
					</MUILink>
				</Button>
			</Stack>
		</ListItem>
	);
};

CourseListItem.propTypes = {
	id: PropTypes.any.isRequired,
	avatarText: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	prof: PropTypes.string.isRequired,
	when: PropTypes.string.isRequired,
	inCall: PropTypes.bool,
};

export default CourseListItem;
