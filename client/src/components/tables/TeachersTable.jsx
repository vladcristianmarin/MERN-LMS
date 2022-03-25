import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, Checkbox, Link as MUILink, Typography, Box, Modal, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listTeachers } from '../../actions/teacherActions';
import styled from '@emotion/styled';

const TeachersTable = () => {
	const dispatch = useDispatch();

	const [countries, setCountries] = useState([]);
	const [showCourses, setShowCourses] = useState(false);
	const [showGroups, setShowGroups] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState({});

	const teacherList = useSelector((state) => state.teacherList);
	const teachers = teacherList.teachers || [];

	const teachersWithId = teachers.map((teach) => {
		return { id: teach._id, ...teach };
	});

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
		dispatch(listTeachers());
	}, [dispatch]);

	const ModalBox = styled(Card)(() => ({
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		padding: 6,
	}));

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
		{ field: 'school', type: 'string', headerName: 'School', flex: 1 },
		{
			field: 'isAdmin',
			type: 'bool',
			headerName: 'Admin',
			renderCell: (params) => {
				return <Checkbox checked={params.row.isAdmin} />;
			},
		},

		{
			field: 'showCourseBtn',
			headerName: 'Courses',
			flex: 1,
			renderCell: (params) => {
				return (
					<Button
						variant='outlined'
						onClick={(e) => {
							e.stopPropagation();
							setSelectedTeacher(params.row);
							setShowCourses(true);
						}}>
						Show
					</Button>
				);
			},
		},
		{
			field: 'showGroupsBtn',
			headerName: 'Groups',
			flex: 1,
			renderCell: (params) => {
				return (
					<Button
						variant='outlined'
						color='secondary'
						onClick={(e) => {
							e.stopPropagation();
							setSelectedTeacher(params.row);
							setShowGroups(true);
						}}>
						Show
					</Button>
				);
			},
		},
	];

	const coursesModal = (
		<Modal open={showCourses} onClose={() => setShowCourses(false)}>
			<ModalBox>
				<Typography id='modal-modal-title' variant='h4' textAlign='center'>
					{`${selectedTeacher.name}'s courses`}
				</Typography>
				<Typography>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
			</ModalBox>
		</Modal>
	);

	const groupsModal = (
		<Modal open={showGroups} onClose={() => setShowCourses(false)}>
			<ModalBox>
				<Typography variant='h4' textAlign='center'>
					{`${selectedTeacher.name}'s groups`}
				</Typography>
				<Typography>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
			</ModalBox>
		</Modal>
	);

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Teachers
			</Typography>
			<DataGrid autoHeight={true} pageSize={5} columns={columns} rows={teachersWithId} pagination='true'></DataGrid>
			{coursesModal}
			{groupsModal}
		</Box>
	);
};

export default TeachersTable;
