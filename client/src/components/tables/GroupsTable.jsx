//* REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//* MUI
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { DataGrid } from '@mui/x-data-grid';
import { Link as MUILink, Typography, Box, List, ListItem, IconButton, Stack, Tooltip, Divider } from '@mui/material';

//* CUSTOM COMPONENTS
import Iconify from '../Iconify';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';
import AddStudentsForm from '../forms/AddStudentsForm';
import EnrollCourseForm from '../forms/EnrollCourseForm';
import CustomToolbar from '../tables/CustomToolbar';

//* FUNCTIONS && CONSTANTS
import { deleteGroup, listGroups } from '../../actions/groupActions';
import {
	GROUP_ADD_STUDENTS_RESET,
	GROUP_DELETE_RESET,
	GROUP_ENROLL_COURSE_RESET,
} from '../../constants/groupConstants';

const GroupsTable = () => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [pageSize, setPageSize] = useState(5);

	const [groupsState, setGroupsState] = useState({
		showDeleteGroupDialog: false,
		showAddStudentsForm: false,
		showAddCourseForm: false,
		selectedGroup: null,
	});

	const groupList = useSelector((state) => state.groupList);
	const groups = groupList.groups || [];

	const groupsToRender = groups.map((group) => {
		return { id: group._id, ...group };
	});

	const { loading: groupListLoading } = groupList;

	const groupDelete = useSelector((state) => state.groupDelete);
	const { error: deleteGroupError, loading: deleteGroupLoading, success: deleteGroupSuccess } = groupDelete;

	const groupAddStudents = useSelector((state) => state.groupAddStudents);
	const { error: addStudentsError, loading: addStudentsLoading, success: addStudentsSuccess } = groupAddStudents;

	const groupEnrollCourse = useSelector((state) => state.groupEnrollCourse);
	const { error: enrollCourseError, loading: enrollCourseLoading, success: enrollCourseSuccess } = groupEnrollCourse;

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
							<ListItem key={i} sx={{ p: 0, m: 0 }}>
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
			field: 'courses',
			type: 'singleSelect',
			headerName: 'Courses',
			flex: 1,
			valueGetter: (value) => ({ ...value.row.courses.map((course) => `${course.acronym} - ${course.teacher.name}`) }),
			renderCell: (params) => {
				const courses = Object.values(params.formattedValue);
				return (
					<List sx={{ alignSelf: 'flex-start' }}>
						{courses.map((course, i) => (
							<React.Fragment key={i}>
								<ListItem sx={{ m: 0, p: 0 }}>
									<Tooltip
										title={`${params.row.courses[i].name} - ${params.row.courses[i].teacher.name} (${params.row.courses[i].teacher.email})`}>
										<span>{course}</span>
									</Tooltip>
								</ListItem>
								<Divider />
							</React.Fragment>
						))}
					</List>
				);
			},
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			flex: 1,
			renderCell: (params) => (
				<Stack direction='row'>
					<Tooltip title='Add students'>
						<IconButton color='success' onClick={showAddStudentsFormHandler.bind(this, params.row)}>
							<Iconify icon='eva:plus-outline' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Enroll in course'>
						<IconButton
							sx={{ color: theme.palette.success.dark }}
							onClick={showAddCourseFormHandler.bind(this, params.row)}>
							<Iconify icon='eva:book-outline' />
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

	const refreshHandler = () => {
		dispatch(listGroups());
	};

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

	const showAddCourseFormHandler = (group) => {
		setGroupsState((prev) => ({ ...prev, showAddCourseForm: true, selectedGroup: group }));
	};

	const hideAddCourseFormHandler = () => {
		setGroupsState((prev) => ({ ...prev, showAddCourseForm: false, selectedGroup: null }));
	};

	const resetAddStudentsState = () => {
		dispatch({ type: GROUP_ADD_STUDENTS_RESET });
	};

	const resetEnrollCourseState = () => {
		dispatch({ type: GROUP_ENROLL_COURSE_RESET });
	};

	const StyledDataGrid = styled(DataGrid)(() => ({
		'& .MuiDataGrid-cell--withRenderer': {
			overflowY: 'auto',
			marginBottom: '10px',
		},
	}));

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Groups
			</Typography>
			<StyledDataGrid
				autoHeight={true}
				rowHeight={65}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				rowsPerPageOptions={[5, 10, 15]}
				columns={columns}
				rows={groupsToRender}
				loading={groupListLoading}
				pagination='true'
				components={{
					Toolbar: () => (
						<CustomToolbar
							refreshHandler={refreshHandler}
							fields={['code', 'school', 'yearOfStudy']}
							fileName='GroupsTable'
						/>
					),
				}}></StyledDataGrid>

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
			<EnrollCourseForm
				open={groupsState.showAddCourseForm}
				handleClose={hideAddCourseFormHandler}
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
			<Toast
				show={enrollCourseSuccess && !enrollCourseLoading}
				timeout={2000}
				severity='success'
				message='Group enrolled in course!'
				onClose={resetEnrollCourseState}
			/>
			<Toast
				show={enrollCourseError && !enrollCourseLoading}
				timeout={3000}
				severity='error'
				message={enrollCourseError}
				onClose={resetEnrollCourseState}
			/>
		</Box>
	);
};

export default GroupsTable;
