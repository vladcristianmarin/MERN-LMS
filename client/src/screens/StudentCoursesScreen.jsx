import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCourses } from '../actions/studentActions';
import CoursesList from '../components/CoursesList';

const StudentCoursesScreen = () => {
	const dispatch = useDispatch();
	const { courses } = useSelector((state) => state.studentMyCourses);

	useEffect(() => {
		dispatch(getMyCourses());
	}, [dispatch]);

	return <CoursesList courses={courses} />;
};

export default StudentCoursesScreen;
