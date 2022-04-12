//* REACT
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//* MUI
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, List, ListItem, IconButton, Stack, Tooltip, Chip } from '@mui/material';

//* CUSTOM COMPONENTS
import Iconify from '../Iconify';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';
import AddStudentsForm from '../forms/AddStudentsForm';
import EnrollCourseForm from '../forms/EnrollCourseForm';
import CustomToolbar from '../tables/CustomToolbar';

//* FUNCTIONS && CONSTANTS
import { deleteGroup, listGroups, removeCourse, removeStudent, updateGroup } from '../../actions/groupActions';
import {
	GROUP_ADD_STUDENTS_RESET,
	GROUP_DELETE_RESET,
	GROUP_ENROLL_COURSE_RESET,
	GROUP_REMOVE_COURSE_RESET,
	GROUP_REMOVE_STUDENT_RESET,
	GROUP_UPDATE_RESET,
} from '../../constants/groupConstants';

const GroupsTable = () => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [pageSize, setPageSize] = useState(5);

	const [groupsState, setGroupsState] = useState({
		showDeleteGroupDialog: false,
		showAddStudentsForm: false,
		showAddCourseForm: false,
		showDeleteStudentDialog: false,
		showDeleteCourseDialog: false,
		selectedGroup: null,
		selectedStudent: null,
		selectedCourse: null,
	});

	const groupList = useSelector((state) => state.groupList);
	const groups = groupList.groups || [];

	const groupsToRender = groups.map((group) => {
		return { id: group._id, ...group };
	});

	const { loading: groupListLoading } = groupList;

	const groupDelete = useSelector((state) => state.groupDelete);
	const { error: deleteGroupError, loading: deleteGroupLoading, success: deleteGroupSuccess } = groupDelete;

	const groupUpdate = useSelector((state) => state.groupUpdate);
	const { error: updateGroupError, loading: updateGroupLoading, success: updateGroupSuccess } = groupUpdate;

	const groupAddStudents = useSelector((state) => state.groupAddStudents);
	const { error: addStudentsError, loading: addStudentsLoading, success: addStudentsSuccess } = groupAddStudents;

	const groupRemoveStudent = useSelector((state) => state.groupRemoveStudent);
	const {
		error: removeStudentError,
		loading: removeStudentLoading,
		success: removeStudentSuccess,
	} = groupRemoveStudent;

	const groupEnrollCourse = useSelector((state) => state.groupEnrollCourse);
	const { error: enrollCourseError, loading: enrollCourseLoading, success: enrollCourseSuccess } = groupEnrollCourse;

	const groupRemoveCourse = useSelector((state) => state.groupRemoveCourse);
	const { error: removeCourseError, loading: removeCourseLoading, success: removeCourseSuccess } = groupRemoveCourse;

	const columns = [
		{ field: 'code', type: 'string', headerName: 'Code', flex: 1, editable: true },

		{
			field: 'school',
			type: 'string',
			headerName: 'School',
			flex: 1,
			editable: true,
			renderCell: (params) => (
				<Tooltip title={params.row.school}>
					<div className='MuiDataGrid-cellContent'>{params.row.school}</div>
				</Tooltip>
			),
		},
		{ field: 'yearOfStudy', type: 'string', headerName: 'Year', flex: 1, editable: true },
		{
			field: 'students',
			type: 'singleSelect',
			headerName: 'Students',
			flex: 1,
			valueGetter: (value) => ({ ...value.row.students.map((stud) => stud.email) }),
			renderCell: (params) => {
				const students = params.row.students.map((stud) => ({ id: stud._id, email: stud.email, name: stud.name }));
				return (
					<List sx={{ alignSelf: 'flex-start' }}>
						{students.map((stud) => (
							<ListItem key={stud.id} sx={{ p: 0, m: 0, mb: 0.5 }}>
								<Chip
									variant='outlined'
									color='primary'
									label={stud.email}
									deleteIcon={
										<IconButton
											color='error'
											sx={{
												p: 0.2,
												m: 0.2,
											}}>
											<Iconify
												width='20px'
												height='20px'
												style={{ color: theme.palette.error.main }}
												icon='eva:close-outline'
											/>
										</IconButton>
									}
									onDelete={showRemoveStudentDialogHandler.bind(this, params.row, stud)}
									onClick={(_e) => (window.location.href = `mailto:${stud.email}`)}
								/>
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
				const courses = params.row.courses;
				return (
					<List sx={{ alignSelf: 'flex-start' }}>
						{courses.map((course) => (
							<ListItem key={course._id} sx={{ p: 0, m: 0, mb: 0.5 }}>
								<Tooltip title={`${course.name} | ${course.teacher.name} (${course.teacher.email})`}>
									<Chip
										variant='outlined'
										color='primary'
										label={`${course.acronym.toUpperCase()} - ${course.teacher.name}`}
										deleteIcon={
											<IconButton
												color='error'
												sx={{
													p: 0.2,
													m: 0.2,
												}}>
												<Iconify
													width='20px'
													height='20px'
													style={{ color: theme.palette.error.main }}
													icon='eva:close-outline'
												/>
											</IconButton>
										}
										onDelete={showRemoveCourseDialogHandler.bind(this, params.row, course)}
									/>
								</Tooltip>
							</ListItem>
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
		setGroupsState((prev) => ({ ...prev, showDeleteGroupDialog: false, selectedGroup: null }));
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

	const showRemoveStudentDialogHandler = (group, student) => {
		setGroupsState((prev) => ({
			...prev,
			showDeleteStudentDialog: true,
			selectedGroup: group,
			selectedStudent: student,
		}));
	};

	const hideRemoveStudentDialogHandler = () => {
		setGroupsState((prev) => ({
			...prev,
			showDeleteStudentDialog: false,
			selectedGroup: null,
			selectedStudent: null,
		}));
	};

	const submitRemoveStudent = () => {
		dispatch(removeStudent(groupsState.selectedGroup.id, groupsState.selectedStudent.id));
		setGroupsState((prev) => ({
			...prev,
			showDeleteStudentDialog: false,
			selectedGroup: null,
			selectedStudent: null,
		}));
	};

	const showRemoveCourseDialogHandler = (group, student) => {
		setGroupsState((prev) => ({
			...prev,
			showDeleteCourseDialog: true,
			selectedGroup: group,
			selectedCourse: student,
		}));
	};

	const hideRemoveCourseDialogHandler = () => {
		setGroupsState((prev) => ({
			...prev,
			showDeleteCourseDialog: false,
			selectedGroup: null,
			selectedCourse: null,
		}));
	};

	const submitRemoveCourse = () => {
		dispatch(removeCourse(groupsState.selectedGroup.id, groupsState.selectedCourse._id));
		setGroupsState((prev) => ({
			...prev,
			showDeleteCourseDialog: false,
			selectedGroup: null,
			selectedCourse: null,
		}));
	};

	const editCommitHandler = (target, e) => {
		if (!(e instanceof PointerEvent)) {
			const updates = {};
			updates[target.field] = typeof target.value === 'string' ? target.value.trim() : target.value;
			dispatch(updateGroup(target.id, updates));
		}
	};

	const editStopHandler = (_params, e) => {
		if (e instanceof PointerEvent) {
			e.defaultMuiPrevented = true;
		}
	};

	const resetAddStudentsState = () => {
		dispatch({ type: GROUP_ADD_STUDENTS_RESET });
	};

	const resetRemoveStudentStateHandler = () => {
		dispatch({ type: GROUP_REMOVE_STUDENT_RESET });
	};

	const resetDeleteStateHandler = () => {
		dispatch({ type: GROUP_DELETE_RESET });
	};

	const resetUpdateStateHandler = () => {
		dispatch({ type: GROUP_UPDATE_RESET });
	};

	const resetEnrollCourseState = () => {
		dispatch({ type: GROUP_ENROLL_COURSE_RESET });
	};

	const resetRemoveCourseStateHandler = () => {
		dispatch({ type: GROUP_REMOVE_COURSE_RESET });
	};

	const StyledDataGrid = styled(DataGrid)(() => ({
		'& .MuiDataGrid-cell--withRenderer': {
			overflow: 'auto',
			marginBottom: '10px',
		},
		minHeight: '400px',
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
				density='comfortable'
				onCellEditCommit={editCommitHandler}
				onCellEditStop={editStopHandler}
				components={{
					Toolbar: () => (
						<CustomToolbar
							refreshHandler={refreshHandler}
							fields={['code', 'school', 'yearOfStudy']}
							fileName='GroupsTable'
							loading={addStudentsLoading || deleteGroupLoading || updateGroupLoading || enrollCourseLoading}
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
			<ConfirmDialog
				open={groupsState.showDeleteStudentDialog}
				handleClose={hideRemoveStudentDialogHandler}
				handleConfirm={submitRemoveStudent}
				loading={removeStudentLoading}
				title='Confirm remove Student from Group'
				message={`You are about to remove ${groupsState.selectedStudent?.name} (${groupsState.selectedStudent?.email}) 
				from group ${groupsState.selectedGroup?.code}. Are you sure you want to do it?`}
			/>
			<ConfirmDialog
				open={groupsState.showDeleteCourseDialog}
				handleClose={hideRemoveCourseDialogHandler}
				handleConfirm={submitRemoveCourse}
				loading={removeCourseLoading}
				title='Confirm remove Course from Group'
				message={`You are about to remove ${groupsState.selectedCourse?.name} (${groupsState.selectedCourse?.acronym}) 
				from group ${groupsState.selectedGroup?.code}. Are you sure you want to do it?`}
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
			<Toast
				show={updateGroupSuccess && !updateGroupLoading}
				timeout={2000}
				severity='success'
				onClose={resetUpdateStateHandler}
				message='Group updated!'
			/>
			<Toast
				show={updateGroupError && !updateGroupLoading}
				timeout={3000}
				severity='error'
				onClose={resetUpdateStateHandler}
				message={updateGroupError}
			/>
			<Toast
				show={removeStudentSuccess && !removeStudentLoading}
				timeout={2000}
				severity='success'
				onClose={resetRemoveStudentStateHandler}
				message='Student removed!'
			/>
			<Toast
				show={removeStudentError && !removeStudentLoading}
				timeout={3000}
				severity='error'
				onClose={resetRemoveStudentStateHandler}
				message={removeStudentError}
			/>
			<Toast
				show={removeCourseSuccess && !removeCourseLoading}
				timeout={2000}
				severity='success'
				onClose={resetRemoveCourseStateHandler}
				message='Course removed!'
			/>
			<Toast
				show={removeCourseError && !removeCourseLoading}
				timeout={3000}
				severity='error'
				onClose={resetRemoveCourseStateHandler}
				message={removeCourseError}
			/>
		</Box>
	);
};

export default GroupsTable;
