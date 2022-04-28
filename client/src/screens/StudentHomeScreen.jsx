import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import AdapterDateFns from '@date-io/date-fns';
import { Box, Card, CircularProgress, List, Typography } from '@mui/material';
import {
	StyledAvatar,
	StyledContainer,
	StyledRightCard,
	StyledRightChildrenCard,
} from '../components/app/styles/StudentHomeScreenStyles.js';

import AppProfileBox from '../components/app/AppProfileBox';
import CoursesList from '../components/CoursesList';
import AppTasks from '../components/forms/AppTasks';
import { LocalizationProvider, StaticDatePicker } from '@mui/lab';
import AppCourseActivity from '../components/app/AppCourseActivity.jsx';
import CourseListItem from '../components/CourseListItem.jsx';

const StudentHomeScreen = () => {
	const theme = useTheme();
	const { userInfo } = useSelector((state) => state.userLogin);
	const studentCourses = useSelector((state) => state.studentMyCourses);

	const { loading: studentCoursesLoading } = studentCourses;

	const courses = studentCourses.courses || [];

	const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const todayCourses = courses.filter((course) => course.weekday === weekdays[new Date().getDay() - 1]);

	return (
		<StyledContainer maxWidth='xl'>
			<Box
				sx={{
					p: 1,
					background: theme.palette.background.default,
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing(6),
					ml: theme.spacing(2),
				}}>
				<div>
					<Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', gap: 1 }}>
						<Typography variant='h3'>Hello, </Typography>
						<Typography variant='h3' sx={{ fontWeight: theme.typography.fontWeightLight }}>
							{userInfo?.name} 👋
						</Typography>
					</Box>
					<Box>
						<Typography variant='body1' color='text.secondary'>
							Nice to have you back!
						</Typography>
						<Typography variant='body1' color='text.secondary'>
							Get ready and attend your courses today.
						</Typography>
					</Box>
					<Box sx={{ mt: 4 }}>
						<Typography variant='h5'>Today's Courses</Typography>
						<Box
							sx={{
								overflow: !studentCoursesLoading && todayCourses.length === 0 ? 'visible' : 'auto',
								maxHeight: '70vh',
								display: 'flex',
								justifyContent: 'center',
								...(studentCoursesLoading && { alignItems: 'center' }),
							}}>
							{studentCoursesLoading && <CircularProgress />}
							{!studentCoursesLoading && todayCourses.length === 0 && (
								<Card
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: theme.spacing(4),
										position: 'relative',
										overflow: 'visible',
									}}>
									<Box
										component='img'
										src='/images/illustration_no_courses_today.png'
										alt='No courses today!'
										sx={{
											objectFit: 'fill',
											m: 1,
											borderRadius: '16px',
											bgcolor: theme.palette.primary.light,
										}}
									/>
									<Card
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											p: theme.spacing(1),
											height: '25%',
											width: '40%',
											bgcolor: theme.palette.primary.lighter,
											position: 'absolute',
											left: 0,
											top: 0,
											transform: 'translate(-30%, 30%)',
											overflow: 'visible',
										}}>
										<Typography variant='subtitle2' color='primary.darker'>
											Looks like you don't have any courses today! 😁
										</Typography>
										<div
											style={{
												width: 0,
												height: 0,
												borderLeft: '1vh solid transparent',
												borderRight: '1vh solid transparent',
												borderTop: `5vh solid ${theme.palette.primary.lighter}`,
												position: 'absolute',
												top: '65%',
												right: '-5%',
												transform: 'rotate(-70deg)',
											}}></div>
									</Card>
								</Card>
							)}

							<List sx={{ width: '100%' }}>
								{todayCourses?.map((course, i) => (
									<CourseListItem key={i} course={course} />
								))}
							</List>
						</Box>
					</Box>
				</div>
				<Card sx={{ width: '100%', height: 'calc(100% - 75vh)' }}>
					<AppTasks />
				</Card>
			</Box>
			<StyledRightCard>
				<StyledRightChildrenCard
					id='user-info-card'
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: theme.spacing(4),
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
					<AppProfileBox />
				</StyledRightChildrenCard>
				<StyledRightChildrenCard sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<StaticDatePicker openTo='day' />
					</LocalizationProvider>
				</StyledRightChildrenCard>
				<StyledRightChildrenCard sx={{ gridColumn: '1 / -1' }}>
					<AppCourseActivity />
				</StyledRightChildrenCard>
			</StyledRightCard>
		</StyledContainer>
	);
};

export default StudentHomeScreen;
