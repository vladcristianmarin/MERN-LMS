import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Avatar,
	Checkbox,
	Link as MUILink,
	Typography,
	Box,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Divider,
	Tooltip,
	DialogTitle,
	Dialog,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listTeacherCourses, listTeachers } from '../../actions/teacherActions';
import { deleteCourse } from '../../actions/courseActions';
import { makeAdmin } from '../../actions/userActions';
import { COURSE_DELETE_RESET } from '../../constants/courseConstants';
import { USER_MAKE_ADMIN_RESET } from '../../constants/userConstants';
import Iconify from '../Iconify';
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';

const TeachersTable = () => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [countries, setCountries] = useState([]);
	const [scrollToTop, setScrollToTop] = useState(false);
	const [pageSize, setPageSize] = useState(5);

	const [coursesState, setCoursesState] = useState({
		showCoursesDialog: false,
		showDeleteCourseDialog: false,
		selectedTeacher: null,
		selectedCourse: null,
	});

	const [adminState, setAdminState] = useState({ showMakeAdminDialog: false, selectedTeacher: null });

	const teacherList = useSelector((state) => state.teacherList);
	const teachers = teacherList.teachers || [];

	const teachersWithId = teachers.map((teach) => {
		return { id: teach._id, ...teach };
	});

	const teacherListCourses = useSelector((state) => state.teacherListCourses);
	const {
		courses,
		error: listCoursesError,
		loading: listCoursesLoading,
		success: listCoursesSuccess,
	} = teacherListCourses;

	const courseDelete = useSelector((state) => state.courseDelete);
	const { error: deleteCourseError, loading: deleteCourseLoading, success: deleteCourseSuccess } = courseDelete;

	const userMakeAdmin = useSelector((state) => state.userMakeAdmin);
	const { error: makeAdminError, loading: makeAdminLoading, success: makeAdminSuccess } = userMakeAdmin;

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
		dispatch(listTeachers());
	}, [dispatch]);

	useEffect(() => {
		if (scrollToTop) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setScrollToTop(false);
		}
	}, [scrollToTop]);

	useEffect(() => {
		if (coursesState.selectedTeacher && coursesState.showCoursesDialog) {
			dispatch(listTeacherCourses(coursesState.selectedTeacher._id));
		}
	}, [dispatch, coursesState.selectedTeacher, coursesState.showCoursesDialog]);

	useEffect(() => {
		if (deleteCourseSuccess && !deleteCourseLoading) {
			setCoursesState((prev) => ({ ...prev, showDeleteCourseDialog: false, selectedCourse: null }));
			dispatch(listTeacherCourses(coursesState.selectedTeacher._id));
		}
		if (makeAdminSuccess && !makeAdminLoading) {
			setAdminState((prev) => ({ ...prev, showMakeAdminDialog: false, selectedTeacher: null }));
			dispatch(listTeachers());
		}
	}, [
		dispatch,
		deleteCourseSuccess,
		deleteCourseLoading,
		makeAdminSuccess,
		makeAdminLoading,
		coursesState.selectedTeacher,
	]);

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
			type: 'actions',
			headerName: 'Admin',
			renderCell: (params) => {
				return (
					<Checkbox
						checked={params.row.isAdmin}
						disabled={params.row.isAdmin}
						onClick={showMakeAdminDialogHandler.bind(this, params.row)}
					/>
				);
			},
		},

		{
			field: 'showCourseBtn',
			headerName: 'Courses',
			type: 'actions',
			flex: 1,
			renderCell: (params) => {
				return (
					<Tooltip title='Show courses'>
						<IconButton color='success' onClick={showCoursesDialogHandler.bind(this, params.row)}>
							<Iconify icon='eva:eye-outline' />
						</IconButton>
					</Tooltip>
				);
			},
		},
	];

	const scrollToTopHandler = () => {
		setCoursesState((prev) => ({ ...prev, showCoursesDialog: false }));
		setScrollToTop(true);
	};

	const showCoursesDialogHandler = (teacher, e) => {
		e.stopPropagation();
		setCoursesState((prev) => ({ ...prev, showCoursesDialog: true, selectedTeacher: teacher }));
	};

	const hideCoursesDialogHandler = () => {
		setCoursesState((prev) => ({ ...prev, showCoursesDialog: false }));
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

	const showMakeAdminDialogHandler = (teacher, e) => {
		e.stopPropagation();
		setAdminState((prev) => ({ ...prev, showMakeAdminDialog: true, selectedTeacher: teacher }));
	};

	const hideMakeAdminDialogHandler = () => {
		setAdminState((prev) => ({ ...prev, showMakeAdminDialog: false, selectedTeacher: null }));
	};

	const submitMakeAdmin = () => {
		dispatch(makeAdmin(adminState.selectedTeacher._id));
	};

	const resetDeleteStateHandler = () => {
		dispatch({ type: COURSE_DELETE_RESET });
	};

	const resetAdminStateHandler = () => {
		dispatch({ type: USER_MAKE_ADMIN_RESET });
	};

	return (
		<>
			<Box sx={{ width: '100%', p: 2 }}>
				<Typography sx={{ ml: 1 }} variant='h4'>
					Teachers
				</Typography>

				<DataGrid
					autoHeight={true}
					rowsPerPageOptions={[5, 10, 15]}
					pageSize={pageSize}
					onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
					columns={columns}
					rows={teachersWithId}
					pagination='true'></DataGrid>

				<Dialog open={coursesState.showCoursesDialog} onClose={hideCoursesDialogHandler}>
					<DialogTitle>{coursesState.selectedTeacher?.name}'s courses</DialogTitle>
					<DialogContent>
						{listCoursesLoading && <CircularProgress />}
						{!listCoursesSuccess && (
							<Typography variant='h5' color='error'>
								{listCoursesError}
							</Typography>
						)}
						{listCoursesSuccess && courses.length > 0 && (
							<List dense={true}>
								{courses.map((course) => (
									<React.Fragment key={course._id}>
										<ListItem sx={{ gap: 2, minWidth: theme.spacing(40) }}>
											<ListItemText primary={course.name} secondary={course.acronym} />
											<Tooltip title='Delete this course'>
												<IconButton color='error' onClick={showDeleteDialogHandler.bind(this, course)}>
													<Iconify id={course._id} icon='eva:trash-outline' />
												</IconButton>
											</Tooltip>
										</ListItem>
										<Divider />
									</React.Fragment>
								))}
							</List>
						)}
						{listCoursesSuccess && courses.length === 0 && (
							<Typography>{coursesState.selectedTeacher?.name} has 0 courses!</Typography>
						)}
					</DialogContent>
					<DialogActions>
						<Button color='inherit' onClick={scrollToTopHandler}>
							Create new course
						</Button>
						<Button color='error' onClick={hideCoursesDialogHandler}>
							Leave
						</Button>
					</DialogActions>
				</Dialog>
				<ConfirmDialog
					title='Confirm Delete Course'
					message={`You are about to delete group ${coursesState.selectedCourse?.code}. Are you sure you want to delete it?`}
					loading={deleteCourseLoading}
					open={coursesState.showDeleteCourseDialog}
					handleClose={hideDeleteDialogHandler}
					handleConfirm={submitDeleteCourse}
				/>
				<ConfirmDialog
					title='Confirm Make Admin'
					message={`You are about to make ${adminState.selectedTeacher?.name} an admin. Are you sure?`}
					loading={makeAdminLoading}
					open={adminState.showMakeAdminDialog}
					handleClose={hideMakeAdminDialogHandler}
					handleConfirm={submitMakeAdmin}
				/>
			</Box>
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
				show={makeAdminSuccess && !makeAdminLoading}
				timeout={2000}
				severity='success'
				onClose={resetAdminStateHandler}
				message='Admin rank granted!'
			/>
			<Toast
				show={makeAdminError && !makeAdminLoading}
				timeout={3000}
				severity='error'
				onClose={resetAdminStateHandler}
				message={makeAdminError}
			/>
		</>
	);
};

export default TeachersTable;
