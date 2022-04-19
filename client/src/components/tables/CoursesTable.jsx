//* REACT
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//* MUI
import AdapterDateFns from '@date-io/date-fns';
import { Box, FormControl, IconButton, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

//* CUSTOM COMPONENTS
import ConfirmDialog from '../ConfirmDialog';
import Iconify from '../Iconify';
import Toast from '../Toast';
import CustomToolbar from '../tables/CustomToolbar';

//* FUNCTIONS && CONSTANTS
import { deleteCourse, listCourses, updateCourse } from '../../actions/courseActions';
import { COURSE_DELETE_RESET, COURSE_UPDATE_RESET } from '../../constants/courseConstants';
import { LocalizationProvider, TimePicker } from '@mui/lab';

const HourEditCell = ({ id, field, row }) => {
	const apiRef = useGridApiContext();
	const [hour, setHour] = useState(new Date(row.hour));

	useEffect(() => {
		apiRef.current.setEditCellValue({ id, field, value: hour });
		// eslint-disable-next-line
	}, [hour]);

	const handleGroupChange = (date) => {
		setHour(date);
	};

	const handleTextFieldChange = (e) => setHour(e.target.valueAsDate);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<FormControl fullWidth>
				<TimePicker
					ampm={false}
					value={hour}
					onChange={handleGroupChange}
					renderInput={(params) => <TextField {...params} onChange={handleTextFieldChange} />}
				/>
			</FormControl>
		</LocalizationProvider>
	);
};

const DayEditCell = ({ id, field, row }) => {
	const apiRef = useGridApiContext();
	const [day, setDay] = useState(row.weekday);

	useEffect(() => {
		apiRef.current.setEditCellValue({ id, field, value: day });
		// eslint-disable-next-line
	}, [day]);

	const handleDayChange = (e) => {
		setDay(e.target.value);
	};

	return (
		<FormControl fullWidth>
			<Select id='weekday-select' value={day} onChange={handleDayChange}>
				{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d, i) => (
					<MenuItem key={i} value={d.toLocaleLowerCase()}>
						{d}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const TeacherEditCell = ({ id, field, row }) => {
	const apiRef = useGridApiContext();
	const [teacher, setTeacher] = useState(row.teacher);
	const teacherList = useSelector((state) => state.teacherList);
	const teachers = teacherList.teachers || [];

	useEffect(() => {
		apiRef.current.setEditCellValue({ id, field, value: teacher });

		// eslint-disable-next-line
	}, [teacher]);

	const handleTeacherChange = (e) => {
		setTeacher(teachers.filter((item) => item._id === e.target.value).shift());
	};
	return (
		<FormControl fullWidth>
			<Select id='teacher-select' value={teacher._id} onChange={handleTeacherChange}>
				{teachers.map((item) => (
					<MenuItem key={item._id} value={item._id}>
						{item.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

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

	const courseUpdate = useSelector((state) => state.courseUpdate);
	const { error: updateCourseError, loading: updateCourseLoading, success: updateCourseSuccess } = courseUpdate;

	useEffect(() => {
		if (deleteCourseSuccess && !deleteCourseLoading) {
			setCoursesState((prev) => ({ ...prev, showDeleteCourseDialog: false, selectedCourse: null }));
		}
	}, [deleteCourseLoading, deleteCourseSuccess]);

	const columns = [
		{
			field: 'name',
			type: 'string',
			headerName: 'Name',
			flex: 1,
			editable: true,
			renderCell: (params) => {
				return (
					<Tooltip title={params.row.name}>
						<div className='MuiDataGrid-cellContent'>{params.row.name}</div>
					</Tooltip>
				);
			},
		},
		{ field: 'acronym', type: 'string', headerName: 'Acronym', flex: 0.5, editable: true },
		{ field: 'description', type: 'string', headerName: 'Description', flex: 1.4, editable: true },
		{
			field: 'teacher',
			type: 'string',
			headerName: 'Teacher',
			flex: 1,
			editable: true,
			valueGetter: (value) => value.row.teacher.name,
			renderEditCell: (params) => <TeacherEditCell {...params} />,
		},
		{
			field: 'weekday',
			type: 'string',
			headerName: 'Day',
			flex: 1,
			editable: true,
			valueGetter: (row) => row.value?.replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
			renderEditCell: (params) => <DayEditCell {...params} />,
		},
		{
			field: 'hour',
			type: 'string',
			headerName: 'Hour',
			flex: 1,
			editable: true,
			valueGetter: (row) => {
				const date = new Date(row.value);
				return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
			},
			renderCell: (params) => (
				<Stack direction='row' alignItems='center' justifyContent='center' gap={0.5}>
					<Box>{params.formattedValue}</Box>
					<Iconify width='20px' height='20px' icon='eva:clock-outline' />
				</Stack>
			),
			renderEditCell: (params) => <HourEditCell {...params} />,
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

	const editCommitHandler = (target, e) => {
		if (!(e instanceof PointerEvent)) {
			const updates = {};
			updates[target.field] = typeof target.value === 'string' ? target.value.trim() : target.value;
			dispatch(updateCourse(target.id, updates));
		}
	};

	const editStopHandler = (_params, e) => {
		if (e instanceof PointerEvent) {
			e.defaultMuiPrevented = true;
		}
	};

	const resetDeleteStateHandler = () => {
		dispatch({ type: COURSE_DELETE_RESET });
	};

	const resetUpdateStateHandler = () => {
		dispatch({ type: COURSE_UPDATE_RESET });
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
				sx={{ minHeight: '400px' }}
				autoHeight={true}
				rowHeight={60}
				pageSize={pageSize}
				onPageSizeChange={pageSizeChangeHandler}
				rowsPerPageOptions={[5, 10, 15]}
				columns={columns}
				rows={coursesToRender}
				pagination='true'
				loading={courseListLoading}
				onCellEditStop={editStopHandler}
				onCellEditCommit={editCommitHandler}
				components={{
					Toolbar: () => (
						<CustomToolbar refreshHandler={refreshHandler} fileName='CoursesTable' loading={updateCourseLoading} />
					),
				}}></DataGrid>
			<ConfirmDialog
				title='Confirm Delete Course'
				message={`You are about to delete course ${coursesState.selectedCourse?.name} (${coursesState.selectedCourse?.acronym}).
				 Are you sure you want to delete it?`}
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
			<Toast
				show={updateCourseSuccess && !updateCourseLoading}
				timeout={2000}
				severity='success'
				onClose={resetUpdateStateHandler}
				message='Course updated!'
			/>
			<Toast
				show={updateCourseError && !updateCourseLoading}
				timeout={3000}
				severity='error'
				onClose={resetUpdateStateHandler}
				message={updateCourseError}
			/>
		</Box>
	);
};

export default CoursesTable;
