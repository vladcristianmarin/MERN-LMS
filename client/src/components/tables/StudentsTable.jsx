import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IconButton, Typography, Box, Stack, Link as MUILink, avatarClasses, Avatar, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Iconify from '../Iconify';
import { studentTableColumns } from './StudentTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import { listStudents } from '../../actions/studentActions';

const StudentsTable = () => {
	const dispatch = useDispatch();

	const [countries, setCountries] = useState([]);

	const studentList = useSelector((state) => state.studentList);
	const students = studentList.students || [];

	const studentsWithId = students.map((stud) => {
		return { id: stud._id, ...stud };
	});

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
		dispatch(listStudents());
	}, [dispatch]);

	const columns = studentTableColumns(countries);

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Students
			</Typography>
			<DataGrid autoHeight={true} pageSize={5} columns={columns} rows={studentsWithId} pagination='true'></DataGrid>
		</Box>
	);
};

export default StudentsTable;
