import React, { useState, useEffect } from 'react';
import { Link as MUILink, Typography, Box, List, ListItem, IconButton, Stack, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGroup, listGroups } from '../../actions/groupActions';
import Iconify from '../Iconify';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';
import { GROUP_ADD_STUDENTS_RESET, GROUP_DELETE_RESET } from '../../constants/groupConstants';
import AddStudentsForm from '../forms/AddStudentsForm';

const GroupsTable = () => {
	const dispatch = useDispatch();

	const [pageSize, setPageSize] = useState(5);

	const [groupsState, setGroupsState] = useState({
		showDeleteGroupDialog: false,
		showAddStudentsForm: false,
		selectedGroup: null,
	});

	const groupList = useSelector((state) => state.groupList);
	const groups = groupList.groups || [];

	const groupsWithId = groups.map((group) => {
		return { id: group._id, ...group };
	});

	const groupDelete = useSelector((state) => state.groupDelete);
	const { error: deleteGroupError, loading: deleteGroupLoading, success: deleteGroupSuccess } = groupDelete;

	const groupAddStudents = useSelector((state) => state.groupAddStudents);
	const { error: addStudentsError, loading: addStudentsLoading, success: addStudentsSuccess } = groupAddStudents;

	useEffect(() => {
		dispatch(listGroups());
	}, [dispatch]);

	useEffect(() => {
		if (deleteGroupSuccess && !deleteGroupLoading) {
			setGroupsState((prev) => ({ ...prev, showDeleteGroupDialog: false, selectedGroup: null }));
			dispatch(listGroups());
		}
		if (addStudentsSuccess && !addStudentsLoading) {
			dispatch(listGroups());
		}
	}, [dispatch, deleteGroupSuccess, deleteGroupLoading, addStudentsSuccess, addStudentsLoading]);

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
						<IconButton color='success' onClick={showAddStudentsFormHandler.bind(this, params.row)}>
							<Iconify icon='eva:plus-outline' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Delete Group'>
						<IconButton color='error' onClick={showDeleteDialogHandler.bind(this, params.row)}>
							<Iconify icon='eva:trash-outline' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	const showDeleteDialogHandler = (group) => {
		setGroupsState((prev) => ({ ...prev, showDeleteGroupDialog: true, selectedGroup: group }));
	};

	const hideDeleteDialogHandler = () => {
		setGroupsState((prev) => ({ ...prev, showDeleteGroupDialog: false, selectedGroup: null }));
	};

	const submitDelete = () => {
		dispatch(deleteGroup(groupsState.selectedGroup._id));
	};

	const resetDeleteStateHandler = () => {
		dispatch({ type: GROUP_DELETE_RESET });
	};

	const showAddStudentsFormHandler = (group) => {
		setGroupsState((prev) => ({ ...prev, showAddStudentsForm: true, selectedGroup: group }));
	};

	const hideAddStudentsFormHandler = () => {
		setGroupsState((prev) => ({ ...prev, showAddStudentsForm: false, selectedGroup: null }));
	};

	const resetAddStudentsState = () => {
		dispatch({ type: GROUP_ADD_STUDENTS_RESET });
	};

	const StyledDataGrid = styled(DataGrid)(() => ({
		'& .MuiDataGrid-cell--withRenderer': {
			overflow: 'auto',
		},
	}));

	console.log(addStudentsError, !addStudentsLoading);

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
				open={groupsState.showDeleteGroupDialog}
				handleClose={hideDeleteDialogHandler}
				handleConfirm={submitDelete}
				loading={deleteGroupLoading}
				title='Confirm Delete Group'
				message={`You are about to delete group ${groupsState.selectedGroup?.code}. Are you sure you want to delete it?`}
			/>
			<AddStudentsForm
				open={groupsState.showAddStudentsForm}
				handleClose={hideAddStudentsFormHandler}
				group={groupsState.selectedGroup}
			/>
			<Toast
				show={deleteGroupSuccess && !deleteGroupLoading}
				timeout={2000}
				severity='success'
				onClose={resetDeleteStateHandler}
				message='Group deleted!'
			/>
			<Toast
				show={deleteGroupError && !deleteGroupLoading}
				timeout={3000}
				severity='error'
				onClose={resetDeleteStateHandler}
				message={deleteGroupError}
			/>
			<Toast
				show={addStudentsSuccess && !addStudentsLoading}
				timeout={2000}
				severity='success'
				message='Students added!'
				onClose={resetAddStudentsState}
			/>
			<Toast
				show={addStudentsError && !addStudentsLoading}
				timeout={3000}
				severity='error'
				message={addStudentsError}
				onClose={resetAddStudentsState}
			/>
		</Box>
	);
};

export default GroupsTable;
