import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import {
	StyledAvatar,
	StyledContainer,
	StyledRightCard,
	StyledRightChildrenCard,
} from './styles/StudentHomeScreenStyles';

import ProfileInfoBox from './components/ProfileInfoBox';
import CoursesList from '../components/CoursesList';

const StudentHomeScreen = () => {
	const { userInfo } = useSelector((state) => state.userLogin);
	const studentCourses = useSelector((state) => state.studentMyCourses);

	const { loading: studentCoursesLoading } = studentCourses;

	const courses = studentCourses.courses || [];

	const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const todayCourses = courses.filter((course) => {
		return course.weekday === weekdays[new Date().getDay()];
	});

	return (
		<StyledContainer maxWidth='xl'>
			<Card sx={{ p: 1 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', gap: 1, ml: 2 }}>
					<Typography variant='h3'>Today's</Typography>
					<Typography variant='h3' sx={{ fontWeight: (theme) => theme.typography.fontWeightLight }}>
						Courses
					</Typography>
					{studentCoursesLoading && <CircularProgress />}
				</Box>
				<CoursesList courses={todayCourses} />
			</Card>
			<StyledRightCard>
				<StyledRightChildrenCard
					id='user-info-card'
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: (theme) => theme.spacing(4),
					}}>
					<Box sx={{ p: 0, position: 'relative' }}>
						<Box
							component='img'
							src='/images/illustration_profile_card_background.jpg'
							alt='Group of people'
							sx={{
								objectFit: 'fill',
								p: 1,
								borderTopLeftRadius: '16px',
								borderTopRightRadius: '16px',
							}}
						/>
						<StyledAvatar variant='square' src={userInfo?.avatar} alt={`${userInfo?.name} profile picture`}>
							{userInfo?.name[0].toUpperCase()}
						</StyledAvatar>
					</Box>
					<ProfileInfoBox />
				</StyledRightChildrenCard>
				<StyledRightChildrenCard>No content idea</StyledRightChildrenCard>
				<StyledRightChildrenCard sx={{ gridColumn: '1 / -1' }}>Schedule / Chart</StyledRightChildrenCard>
			</StyledRightCard>
		</StyledContainer>
	);
};

export default StudentHomeScreen;
