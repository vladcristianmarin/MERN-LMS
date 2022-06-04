import { Button, List } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listExamsStudent } from '../actions/examActions';

const StudentExamsScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, exams } = useSelector((state) => state.examListStudent);

	useEffect(() => {
		dispatch(listExamsStudent());
	}, [dispatch]);

	console.log(exams);
	return (
		<List>
			{exams?.map((e) => (
				<Button
					key={e._id}
					onClick={() => {
						navigate(`/exams/${e._id}`, { replace: true, state: e });
					}}>
					{e.title}
				</Button>
			))}
		</List>
	);
};

export default StudentExamsScreen;
