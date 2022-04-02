import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDialog from '../ConfirmDialog';
import Iconify from '../Iconify';
import { deleteCourse, listCourses } from '../../actions/courseActions';
import Toast from '../Toast';
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

	const coursesWithId = courses.map((group) => {
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
			field: 'actions',
			type: 'actions',
			renderCell: (params) => (
				<Stack direction='row'>
					<Tooltip title='Edit Course'>
						<IconButton color='secondary' onClick={() => {}}>
							<Iconify icon='eva:edit-2-outline' />
						</IconButton>
					</Tooltip>
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
				rows={coursesWithId}
				pagination='true'></DataGrid>
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
