import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Avatar,
	Button,
	Checkbox,
	Link as MUILink,
	Typography,
	Box,
	Modal,
	Card,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Divider,
	Fab,
	Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Iconify from '../Iconify';
import Toast from '../Toast';
import { useDispatch, useSelector } from 'react-redux';
import { listTeacherCourses, listTeachers } from '../../actions/teacherActions';
import { deleteCourse } from '../../actions/courseActions';
import { makeAdmin } from '../../actions/userActions';
import { COURSE_DELETE_RESET } from '../../constants/courseConstants';
import { USER_MAKE_ADMIN_RESET } from '../../constants/userContstants';

const TeachersTable = () => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [countries, setCountries] = useState([]);
	const [showCourses, setShowCourses] = useState(false);
	const [showConfirmAdmin, setShowConfirmAdmin] = useState(false);
	const [confirmMakeAdmin, setConfirmMakeAdmin] = useState(false);
	const [goToTop, setGoToTop] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState({});
	const [selectedCourse, setSelectedCourse] = useState('');

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
		if (deleteCourseSuccess) {
			dispatch(listTeacherCourses(selectedTeacher._id));
		}
	}, [dispatch, deleteCourseSuccess, selectedTeacher]);

	useEffect(() => {
		if (makeAdminSuccess) {
			dispatch(listTeachers());
		}
	}, [dispatch, makeAdminSuccess]);

	useEffect(() => {
		if (goToTop) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setGoToTop(false);
		}
	}, [goToTop]);

	useEffect(() => {
		if (selectedTeacher && confirmMakeAdmin) {
			dispatch(makeAdmin(selectedTeacher._id));
			setShowConfirmAdmin(false);
		}
	}, [selectedTeacher, confirmMakeAdmin, dispatch]);

	function makeAdminHandler() {
		setSelectedTeacher(this);
		setShowConfirmAdmin(true);
	}

	const ModalBox = styled(Card)(({ theme }) => ({
		display: 'flex',
		minWidth: theme.spacing(40),
		flexDirection: 'column',
		alignItems: 'center',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		padding: theme.spacing(3),
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
				return (
					<Checkbox
						checked={params.row.isAdmin}
						disabled={params.row.isAdmin}
						onChange={makeAdminHandler.bind(params.row)}
					/>
				);
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
							dispatch(listTeacherCourses(params.row._id));
							setShowCourses(true);
						}}>
						Show
					</Button>
				);
			},
		},
	];

	const deleteCourseHandler = () => {
		dispatch(deleteCourse(selectedCourse));
		setSelectedCourse('');
	};

	const deleteCourseReset = () => {
		dispatch({ type: COURSE_DELETE_RESET });
	};
	const makeAdminReset = () => {
		dispatch({ type: USER_MAKE_ADMIN_RESET });
	};

	const coursesModal = (
		<Modal open={showCourses} onClose={() => setShowCourses(false)}>
			<ModalBox>
				<Typography variant='h4'>{`${selectedTeacher.name}'s courses`}</Typography>
				{listCoursesLoading && <CircularProgress />}
				{!listCoursesSuccess && (
					<Typography variant='h5' color='error'>
						{listCoursesError}
					</Typography>
				)}
				{listCoursesSuccess && (
					<List dense={true}>
						{courses.map((course) => (
							<React.Fragment key={course._id}>
								<ListItem sx={{ gap: 2, minWidth: theme.spacing(40) }}>
									<ListItemText primary={course.name} secondary={course.acronym} />
									<IconButton
										onClick={(e) => {
											setSelectedCourse(e.target.id);
										}}>
										<Iconify id={course._id} icon='eva:trash-outline' />
									</IconButton>
								</ListItem>
								<Divider />
							</React.Fragment>
						))}
					</List>
				)}
				{listCoursesSuccess && courses.length === 0 && <Typography variant='h6'>This teacher has 0 courses</Typography>}
				<Fab
					sx={{ alignSelf: 'flex-end' }}
					color='primary'
					label='Add'
					onClick={() => {
						setShowCourses(false);
						setGoToTop(true);
					}}>
					<Iconify sx={{ width: 32, height: 32 }} icon='eva:plus-outline' />
				</Fab>
			</ModalBox>
		</Modal>
	);

	const confirmDelete = (
		<Modal open={selectedCourse !== ''} onClose={() => setSelectedCourse('')}>
			<ModalBox>
				<Typography variant='h5'>Are you sure you want to delete this course?</Typography>
				<Stack spacing={3} direction='row' sx={{ pt: 2 }}>
					<LoadingButton
						fullWidth
						size='large'
						type='button'
						variant='contained'
						loading={deleteCourseLoading}
						onClick={deleteCourseHandler}>
						Yes
					</LoadingButton>
					<Button
						fullWidth
						size='large'
						color='error'
						type='submit'
						variant='contained'
						onClick={() => setSelectedCourse('')}>
						No
					</Button>
				</Stack>
			</ModalBox>
		</Modal>
	);

	const confirmAdmin = (
		<Modal open={showConfirmAdmin} onClose={() => setShowConfirmAdmin(false)}>
			<ModalBox>
				<Typography variant='h5'>You are about to make {selectedTeacher?.name} an admin!</Typography>
				<Stack spacing={3} direction='row' sx={{ pt: 2 }}>
					<LoadingButton
						fullWidth
						size='large'
						type='button'
						variant='contained'
						loading={makeAdminLoading}
						onClick={() => setConfirmMakeAdmin(true)}>
						Confirm
					</LoadingButton>
					<Button
						fullWidth
						size='large'
						color='error'
						type='submit'
						variant='contained'
						onClick={() => setShowConfirmAdmin(false)}>
						Cancel
					</Button>
				</Stack>
			</ModalBox>
		</Modal>
	);

	return (
		<>
			<Box sx={{ width: '100%', p: 2 }}>
				<Typography sx={{ ml: 1 }} variant='h4'>
					Teachers
				</Typography>
				<DataGrid autoHeight={true} pageSize={5} columns={columns} rows={teachersWithId} pagination='true'></DataGrid>
				{coursesModal}
				{confirmDelete}
				{confirmAdmin}
			</Box>
			<Toast
				show={deleteCourseSuccess && !deleteCourseLoading}
				timeout={500}
				severity='success'
				message='Course deleted!'
				onClose={deleteCourseReset}
			/>
			<Toast
				show={deleteCourseError && !deleteCourseLoading}
				timeout={500}
				severity='error'
				message={deleteCourseError}
				onClose={deleteCourseReset}
			/>
			<Toast
				show={makeAdminSuccess && !makeAdminLoading}
				timeout={500}
				severity='success'
				message='Admin granted!'
				onClose={makeAdminReset}
			/>
			<Toast
				show={makeAdminError && !makeAdminLoading}
				timeout={500}
				severity='error'
				message={makeAdminError}
				onClose={makeAdminReset}
			/>
		</>
	);
};

export default TeachersTable;
