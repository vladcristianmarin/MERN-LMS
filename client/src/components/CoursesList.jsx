import { useTheme } from '@emotion/react';
import { Container, List, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
import CourseListItem from './CourseListItem';

const CoursesList = ({ courses }) => {
	const theme = useTheme();
	const { userInfo } = useSelector((state) => state.userLogin);

	return (
		<main
			style={{
				backgroundImage: "url('/images/illustration_my_courses_bck.png')",
				backgroundColor: theme.palette.background.paper,
				backgroundSize: 'cover',
				borderRadius: '16px',
				padding: theme.spacing(1),
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', gap: 0.5, pb: 5 }}>
				<Typography variant='h3'>{userInfo?.name}'s</Typography>
				<Typography variant='h3' sx={{ fontWeight: (theme) => theme.typography.fontWeightLight }}>
					Courses 📚
				</Typography>
			</Box>
			<Container maxWidth='xl'>
				<List
					sx={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						gap: theme.spacing(2),
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					{courses?.map((course, i) => (
						<CourseListItem key={i} course={course} />
					))}
				</List>
			</Container>
		</main>
	);
};

export default CoursesList;
