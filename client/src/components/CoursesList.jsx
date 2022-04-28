import { List } from '@mui/material';
import React from 'react';
import CourseListItem from './CourseListItem';

const CoursesList = ({ courses }) => {
	return (
		<List sx={{ width: '100%' }}>
			{courses?.map((course, i) => (
				<CourseListItem key={i} course={course} />
			))}
		</List>
	);
};

export default CoursesList;
