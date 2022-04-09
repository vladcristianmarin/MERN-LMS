//* REACT
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//* MUI
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

//* CUSTOM COMPONENTS
import ConfirmDialog from '../ConfirmDialog';
import Iconify from '../Iconify';
import Toast from '../Toast';
import CustomToolbar from '../tables/CustomToolbar';

//* FUNCTIONS && CONSTANTS
import { deleteCourse, listCourses } from '../../actions/courseActions';
import { COURSE_DELETE_RESET } from '../../constants/courseConstants';

const CoursesTable = () => {
	const dispatch = useDispatch();

	const [pageSize, setPageSize] = useState(5);

	const [coursesState, setCoursesState] = useState({
		showDeleteCourseDialog: false,
		selectedCourse: null,
	});

	const courseList = useSelector((state) => state.courseList);
	const courses = courseList.courses || [];

	const { loading: courseListLoading } = courseList;

	const coursesToRender = courses.map((group) => {
		return { id: group._id, ...group };
	});

	const courseDelete = useSelector((state) => state.courseDelete);
	const { error: deleteCourseError, loading: deleteCourseLoading, success: deleteCourseSuccess } = courseDelete;

	useEffect(() => {
		if (deleteCourseSuccess && !deleteCourseLoading) {
			setCoursesState((prev) => ({ ...prev, showDeleteCourseDialog: false, selectedCourse: null }));
			dispatch(listCourses());
		}
	}, [dispatch, deleteCourseSuccess, deleteCourseLoading]);

	const columns = [
		{
			field: 'name',
			type: 'string',
			headerName: 'Name',
			flex: 1,
			renderCell: (params) => {
				return (
					<Tooltip title={params.row.name}>
						<div className='MuiDataGrid-cellContent'>{params.row.name}</div>
					</Tooltip>
				);
			},
		},
		{ field: 'acronym', type: 'string', headerName: 'Acronym', flex: 1 },
		{
			field: 'teacher',
			type: 'string',
			headerName: 'Teacher',
			flex: 1,
			valueGetter: (value) => value.row.teacher.name,
		},
		{
			field: 'weekday',
			type: 'string',
			headerName: 'Day',
			flex: 1,
			valueGetter: (row) => row.value?.replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
		},
		{
			field: 'hour',
			type: 'string',
			headerName: 'Hour',
			flex: 1,
			valueGetter: (row) => {
				const date = new Date(row.value);
				return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
			},
		},
		{
			field: 'actions',
			headerName: 'Actions',
			type: 'actions',
			renderCell: (params) => (
				<Stack direction='row'>
					<Tooltip title='Delete Course'>
						<IconButton color='error' onClick={showDeleteDialogHandler.bind(this, params.row)}>
							<Iconify icon='eva:trash-outline' />
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];

	const pageSizeChangeHandler = (newPageSize) => {
		setPageSize(newPageSize);
	};

	const showDeleteDialogHandler = (course) => {
		setCoursesState((prev) => ({ ...prev, showDeleteCourseDialog: true, selectedCourse: course }));
	};

	const hideDeleteDialogHandler = () => {
		setCoursesState((prev) => ({ ...prev, showDeleteCourseDialog: false, selectedCourse: null }));
	};

	const submitDeleteCourse = () => {
		dispatch(deleteCourse(coursesState.selectedCourse._id));
	};

	const resetDeleteStateHandler = () => {
		dispatch({ type: COURSE_DELETE_RESET });
	};

	const refreshHandler = () => {
		dispatch(listCourses());
	};

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Courses
			</Typography>

			<DataGrid
				autoHeight={true}
				rowHeight={60}
				pageSize={pageSize}
				onPageSizeChange={pageSizeChangeHandler}
				rowsPerPageOptions={[5, 10, 15]}
				columns={columns}
				rows={coursesToRender}
				pagination='true'
				loading={courseListLoading}
				components={{
					Toolbar: () => <CustomToolbar refreshHandler={refreshHandler} fileName='CoursesTable' />,
				}}></DataGrid>
			<ConfirmDialog
				title='Confirm Delete Course'
				message={`You are about to delete group ${coursesState.selectedCourse?.code}. Are you sure you want to delete it?`}
				loading={deleteCourseLoading}
				open={coursesState.showDeleteCourseDialog}
				handleClose={hideDeleteDialogHandler}
				handleConfirm={submitDeleteCourse}
			/>
			<Toast
				show={deleteCourseSuccess && !deleteCourseLoading}
				timeout={2000}
				severity='success'
				onClose={resetDeleteStateHandler}
				message='Course deleted!'
			/>
			<Toast
				show={deleteCourseError && !deleteCourseLoading}
				timeout={3000}
				severity='error'
				onClose={resetDeleteStateHandler}
				message={deleteCourseError}
			/>
		</Box>
	);
};

export default CoursesTable;
