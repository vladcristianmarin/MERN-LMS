import React from 'react';
import { useSelector } from 'react-redux';
import CourseListItem from '../components/CourseListItem';
import { Box, Divider, List, Stack, Typography } from '@mui/material';

const StudentHomeScreen = () => {
	const { userInfo } = useSelector((state) => state.userLogin);
	return (
		<Box>
			<Stack spacing={2}>
				<Typography variant='h3'>{userInfo?.name}’s Courses</Typography>
				<Divider sx={{ width: '100%' }} />
				<List sx={{ gap: 2 }}>
					<CourseListItem
						id='1'
						avatarText='CTS'
						title='Calitate si testare software, Curs'
						prof='Bogdan Iancu'
						when='Wed, 16:30'
						inCall={true}
					/>
					<CourseListItem
						id='2'
						avatarText='ST'
						title='Serii de timp, Sem'
						prof='Manta Eduard-Mihai'
						when='Mon, 7:30'
					/>
					<CourseListItem
						id='3'
						avatarText='RC'
						title='Retele de Calculatoare, Curs'
						prof='Nemedi Iulian'
						when='Thu, 19:00'
					/>
					<CourseListItem
						id='4'
						avatarText='PS'
						title='Pachete Software'
						prof='Oprea Simona-Vasilica'
						when='Fri, 12:00'
					/>
				</List>
			</Stack>
		</Box>
	);
};

export default StudentHomeScreen;
