import React, { useState, useEffect } from 'react';
import { Link as MUILink, Typography, Box, List, ListItem, IconButton, Stack, Tooltip, Modal } from '@mui/material';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { listGroups } from '../../actions/groupActions';
import Iconify from '../Iconify';
import ConfirmDialog from '../ConfirmDialog';

const GroupsTable = () => {
	const dispatch = useDispatch();

	const [pageSize, setPageSize] = useState(5);
	const [showAddStudents, setShowAddStudents] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null);

	const groupList = useSelector((state) => state.groupList);
	const groups = groupList.groups || [];

	const groupsWithId = groups.map((group) => {
		return { id: group._id, ...group };
	});

	useEffect(() => {
		dispatch(listGroups());
	}, [dispatch]);

	const handleShowDeleteDialog = (group) => {
		setShowDeleteDialog(true);
		setSelectedGroup(group);
	};

	const columns = [
		{ field: 'code', type: 'string', headerName: 'Code', flex: 1 },
		{
			field: 'school',
			type: 'string',
			headerName: 'School',
			flex: 1,
			renderCell: (params) => {
				return (
					<Tooltip title={params.row.school}>
						<div className='MuiDataGrid-cellContent'>{params.row.school}</div>
					</Tooltip>
				);
			},
		},
		{ field: 'yearOfStudy', type: 'string', headerName: 'Year', flex: 1 },
		{
			field: 'students',
			type: 'singleSelect',
			headerName: 'Students',
			flex: 1,
			valueGetter: (value) => ({ ...value.row.students.map((stud) => stud.email) }),
			renderCell: (params) => {
				const emails = Object.values(params.formattedValue);
				return (
					<List sx={{ alignSelf: 'flex-start' }}>
						{emails.map((email, i) => (
							<ListItem key={i}>
								<MUILink
									color='text.primary'
									component={Link}
									to='#'
									onClick={(e) => {
										e.preventDefault();
										window.location.href = `mailto:${email}`;
									}}>
									{email}
								</MUILink>
							</ListItem>
						))}
					</List>
				);
			},
		},
		{
			field: 'actions',
			type: 'actions',
			renderCell: (params) => (
				<Stack direction='row'>
					<Tooltip title='Add students'>
						<IconButton
							color='success'
							onClick={() => {
								setShowAddStudents(true);
							}}>
							<Iconify icon='eva:plus-outline' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Delete Group'>
						<IconButton color='error' onClick={handleShowDeleteDialog.bind(this, params.row)}>
							<Iconify icon='eva:trash-outline' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	const StyledDataGrid = styled(DataGrid)(() => ({
		'& .MuiDataGrid-cell--withRenderer': {
			overflow: 'auto',
		},
	}));

	// const addStudentsModal = (
	// 	<Modal disableScrollLock open={showAddStudents} onClose={() => setShowAddStudents(false)}>
	// 		<ModalBox>
	// 			<Typography variant='h4'>Add students</Typography>
	// 		</ModalBox>
	// 	</Modal>
	// );

	const handleCloseDeleteDialog = () => {
		setShowDeleteDialog(false);
		setSelectedGroup(null);
	};

	const handleDeleteGroup = () => {
		console.log('Deleted');
	};

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Groups
			</Typography>
			<StyledDataGrid
				autoHeight={true}
				rowHeight={60}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				rowsPerPageOptions={[5, 10, 15]}
				columns={columns}
				rows={groupsWithId}
				pagination='true'></StyledDataGrid>
			<ConfirmDialog
				open={showDeleteDialog}
				handleClose={handleCloseDeleteDialog}
				handleConfirm={handleDeleteGroup}
				reducer='courseDelete'
				title='Confirm Delete Group'
				message={`You are about to delete group ${selectedGroup?.code}. Are you sure you want to delete it?`}
			/>
		</Box>
	);
};

export default GroupsTable;
