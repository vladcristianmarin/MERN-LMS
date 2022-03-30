import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { studentTableColumns } from './StudentTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import { listStudents } from '../../actions/studentActions';

const StudentsTable = () => {
	const dispatch = useDispatch();

	const [countries, setCountries] = useState([]);
	const [pageSize, setPageSize] = useState(5);

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
			<DataGrid
				autoHeight={true}
				rowsPerPageOptions={[5, 10, 15]}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				columns={columns}
				rows={studentsWithId}
				pagination='true'></DataGrid>
		</Box>
	);
};

export default StudentsTable;
