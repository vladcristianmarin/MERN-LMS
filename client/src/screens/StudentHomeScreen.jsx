import React from 'react';
import { useSelector } from 'react-redux';
import CourseListItem from '../components/CourseListItem';
import { Box, Container, Divider, List, Stack, Typography } from '@mui/material';

const StudentHomeScreen = () => {
	const { userInfo } = useSelector((state) => state.userLogin);
	return <Container maxWidth='xl'></Container>;
};

export default StudentHomeScreen;
