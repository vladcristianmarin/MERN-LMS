//* REACT
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//* MUI
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Avatar, Link as MUILink, Typography, Box, FormControl, Select, MenuItem, Stack } from '@mui/material';

//* CUSTOM COMPONENTS
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';
import CustomToolbar from '../tables/CustomToolbar';

//* FUNCTIONS && CONSTANTS
import { changeGroup, listStudents } from '../../actions/studentActions';

//* EXTRAS
import axios from 'axios';
import { STUDENT_CHANGE_GROUP_RESET } from '../../constants/studentConstants';

const GroupEditCell = ({ id, field, row }) => {
	const apiRef = useGridApiContext();
	const [group, setGroup] = useState(row.group);
	const groupList = useSelector((state) => state.groupList);
	const groups = groupList.groups || [];

	useEffect(() => {
		apiRef.current.setEditCellValue({ id, field, value: group });
		// eslint-disable-next-line
	}, [group]);

	const handleGroupChange = (e) => {
		setGroup(groups.filter((item) => item._id === e.target.value).shift());
	};

	if (!group) {
		return (
			<Stack direction='column'>
				<Typography variant='subtitle1' color='error'>
					Cannot do this!
				</Typography>
				<Typography variant='caption'>Press ESC to abort!</Typography>
			</Stack>
		);
	}

	return (
		<FormControl fullWidth>
			<Select id='group-select' value={group._id} onChange={handleGroupChange}>
				{groups.map((item) => (
					<MenuItem key={item._id} value={item._id}>
						{item.code}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const StudentsTable = () => {
	const dispatch = useDispatch();

	const [countries, setCountries] = useState([]);
	const [pageSize, setPageSize] = useState(5);

	const [selectedStudent, setSelectedStudent] = useState(null);
	const [changeGroupState, setChangeGroupState] = useState({ showConfirmChangeGroup: false, newGroup: null });

	const studentList = useSelector((state) => state.studentList);
	const students = studentList.students || [];

	const { loading: studentListLoading } = studentList;

	const studentChangeGroup = useSelector((state) => state.studentChangeGroup);
	const {
		loading: studentChangeGroupLoading,
		error: studentChangeGroupError,
		success: studentChangeGroupSuccess,
		student,
	} = studentChangeGroup;

	const studentsToRender = students.map((stud) => {
		return { id: stud._id, ...stud };
	});

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
	}, [dispatch]);

	// useEffect(() => {
	// 	if (studentChangeGroupSuccess && !studentChangeGroupLoading) {
	// 		dispatch(listStudents());
	// 	}
	// }, [dispatch, studentChangeGroupSuccess, studentChangeGroupLoading]);

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
		{
			field: 'score',
			type: 'number',
			headerName: 'Score',
			flex: 1,
			renderCell: (params) => {
				const score = params.row.grades.reduce((acc, cur) => acc + cur.score, 0);
				return score;
			},
		},
		{
			field: 'group',
			type: 'string',
			headerName: 'Group',
			flex: 1,
			editable: true,
			valueGetter: (params) => params.row.group?.code,
			renderEditCell: (params) => <GroupEditCell {...params} />,
		},
	];

	const editStartHandler = (params) => {
		setSelectedStudent(params.row);
	};

	const editStopHandler = (_params, e) => {
		if (e instanceof PointerEvent) {
			setChangeGroupState((state) => ({ ...state, showConfirmChangeGroup: false, newGroup: null }));
			e.defaultMuiPrevented = true;
		}
	};

	const editCommitHandler = ({ value }, e) => {
		if (!(e instanceof PointerEvent) && value)
			setChangeGroupState((state) => ({ ...state, showConfirmChangeGroup: true, newGroup: value.code }));
	};

	const submitEdit = () => {
		dispatch(changeGroup(selectedStudent.id, changeGroupState.newGroup));
		setChangeGroupState((state) => ({ ...state, showConfirmChangeGroup: false, newGroup: null }));
	};

	const closeDialogHandler = () => {
		setChangeGroupState((state) => ({ ...state, showConfirmChangeGroup: false, newGroup: null }));
	};

	const refreshHandler = () => {
		dispatch(listStudents());
	};

	const resetStudentChangeGroupState = () => {
		dispatch({ type: STUDENT_CHANGE_GROUP_RESET });
	};

	return (
		<Box sx={{ width: '100%', p: 2 }}>
			<Typography sx={{ ml: 1 }} variant='h4'>
				Students
			</Typography>
			<DataGrid
				autoHeight={true}
				rowsPerPageOptions={[5, 10, 15]}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				columns={columns}
				rows={studentsToRender}
				pagination={true}
				loading={studentListLoading}
				onCellEditStart={editStartHandler}
				onCellEditStop={editStopHandler}
				onCellEditCommit={editCommitHandler}
				components={{
					Toolbar: () => (
						<CustomToolbar
							refreshHandler={refreshHandler}
							fileName='StudentsTable'
							loading={studentChangeGroupLoading}
						/>
					),
				}}></DataGrid>
			<ConfirmDialog
				title='Confirm change group!'
				message={`You are about to move ${selectedStudent?.name} (${selectedStudent?.email}) from ${selectedStudent?.group?.code} 
									to ${changeGroupState.newGroup}. 
									Are you sure you want to do this?`}
				open={changeGroupState.showConfirmChangeGroup}
				loading={studentChangeGroupLoading}
				handleConfirm={submitEdit}
				handleClose={closeDialogHandler}
			/>
			<Toast
				show={studentChangeGroupSuccess && !studentChangeGroupLoading}
				timeout={2000}
				severity='success'
				message={student ? `${student?.name} moved from ${student?.oldGroup} to ${student?.newGroup}` : ''}
				onClose={resetStudentChangeGroupState}
			/>
			<Toast
				show={studentChangeGroupError && !studentChangeGroupLoading}
				timeout={3000}
				severity='error'
				message={studentChangeGroupError}
				onClose={resetStudentChangeGroupState}
			/>
		</Box>
	);
};

export default StudentsTable;
