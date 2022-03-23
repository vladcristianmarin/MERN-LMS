import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, Typography, Box, Stack, Link as MUILink, avatarClasses, Avatar, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Iconify from '../Iconify';

const StudentsTable = () => {
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
	}, []);

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
			field: 'isAdmin',
			headerName: 'Admin',
			flex: 1,
			type: 'bool',
			renderCell: (params) => {
				return <Checkbox color='secondary' checked={params.row.isAdmin} />;
			},
		},
		{ field: 'score', headerName: 'Score', flex: 1 },
		{ field: 'group', type: 'string', headerName: 'Group', flex: 1 },
	];

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Students
			</Typography>
			<DataGrid
				autoHeight={true}
				pageSize={5}
				columns={columns}
				rows={[
					{
						id: '1',
						avatar:
							'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
						name: 'Mihai',
						email: 'mihai@example.com',
						phoneNumber: '0724253736',
						country: 'Romania',
						isAdmin: true,
						group: '1087',
						score: '9.83',
					},
					{
						id: '2',
						avatar:
							'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
						name: 'Alex',
						email: 'alex@example.com',
						phoneNumber: '0724253736',
						country: 'Romania',
						isAdmin: true,
						group: '1087',
						score: '6.83',
					},
					{
						id: '3',
						name: 'Andreea',
						email: 'andreea@example.com',
						phoneNumber: '0724253736',
						country: 'Romania',
						isAdmin: true,
						group: '1087',
						score: '9.83',
					},
					{
						id: '4',
						name: 'Georgiana',
						email: 'georgiana@example.com',
						phoneNumber: '0724253736',
						country: 'Romania',
						isAdmin: true,
						group: '1087',
						score: '9.83',
					},
					{
						id: '5',
						avatar:
							'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
						name: 'Mihai',
						email: 'mihai@example.com',
						phoneNumber: '0724253736',
						country: 'Romania',
						isAdmin: true,
						group: '1087',
						score: '9.83',
					},
				]}
				pagination='true'></DataGrid>
		</Box>
	);
};

export default StudentsTable;
