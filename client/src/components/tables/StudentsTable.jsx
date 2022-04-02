import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Link as MUILink, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

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
	}, [dispatch]);

	const columns = [
		{
			field: 'avatar',
			headerName: '',
			width: 64,
			renderCell: (params) => {
				return (
					<Avatar src={params.row?.avatar} alt={params.row.name + ' profile picture'}>
						{params.row.name[0].toUpperCase()}
					</Avatar>
				);
			},
		},
		{ field: 'name', type: 'string', headerName: 'Name', flex: 1 },
		{
			field: 'email',
			type: 'string',
			headerName: 'Email',
			minWidth: 200,
			flex: 1,
			renderCell: (params) => {
				return (
					<MUILink
						color='text.primary'
						component={Link}
						to='#'
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `mailto:${params.row.email}`;
						}}>
						{params.row.email}
					</MUILink>
				);
			},
		},
		{
			field: 'phoneNumber',
			type: 'string',
			headerName: 'Phone',
			flex: 1,
			renderCell: (params) => {
				return (
					<MUILink
						color='text.primary'
						component={Link}
						to='#'
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `tel:${params.row.phoneNumber}`;
						}}>
						{params.row.phoneNumber}
					</MUILink>
				);
			},
		},
		{
			field: 'country',
			type: 'string',
			headerName: 'Country',
			flex: 1,
			renderCell: (params) => {
				return <Typography>{countries.filter((country) => country.includes(params.row.country)).shift()}</Typography>;
			},
		},
		{
			field: 'score',
			headerName: 'Score',
			flex: 1,
			renderCell: (params) => {
				const score = params.row.grades.reduce((acc, cur) => acc + cur.score, 0);
				return score;
			},
		},
		{
			field: 'group',
			type: 'string',
			headerName: 'Group',
			flex: 1,
			renderCell: (params) => {
				return params.row.group?.code;
			},
		},
	];

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
