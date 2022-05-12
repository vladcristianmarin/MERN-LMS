import { useTheme } from '@emotion/react';
import { Avatar, Button, CircularProgress, Container, Divider, List, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCourseResources } from '../actions/courseActions';
import { CURRENT_URL } from '../constants/extra';
import { simpleDateFormat } from './chat/utils/dateformatting';

import Iconify from './Iconify';

const CourseResourcesList = ({ courseId }) => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const { loading, error, resources } = useSelector((state) => state.courseListResources);

	useEffect(() => {
		if (courseId) {
			dispatch(listCourseResources(courseId));
		}
	}, [dispatch, courseId]);

	const downloadHandler = (res) => {
		const url = `${CURRENT_URL}/${res.file}`;
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = res.originalname;
				link.click();
			})
			.catch(console.error);
	};

	const containerSx = loading || error ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {};

	return (
		<Container maxWidth='xl' sx={{ mt: theme.spacing(3), ...containerSx }}>
			{loading ? (
				<CircularProgress />
			) : error ? (
				<Typography variant='h4' color='error'>
					Something went wrong! {error} <br /> Try to reload the page!
				</Typography>
			) : (
				<List>
					{resources.map((res) => (
						<div key={res._id}>
							<Stack direction='row' sx={{ gap: theme.spacing(1), alignItems: 'center' }}>
								<Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
									<Iconify sx={{ width: 32, height: 32 }} icon='eva:folder-outline' />
								</Avatar>
								<Typography variant='h5'>{simpleDateFormat(res.createdAt)}</Typography>
							</Stack>
							<div
								style={{
									marginLeft: theme.spacing(7),
									display: 'flex',
									flexDirection: 'column',
									gap: theme.spacing(0.5),
								}}>
								<Typography variant='subtitle1'>{res.title}</Typography>
								<Typography variant='body1' color='text.secondary' sx={{ width: '50%' }}>
									{res.description}
								</Typography>
								<Button
									variant='contained'
									sx={{
										alignSelf: 'flex-start',
										mt: theme.spacing(2),
										...theme.typography.body2,
										textTransform: 'none',
									}}
									startIcon={<Iconify icon='eva:download-outline' />}
									onClick={downloadHandler.bind(this, res)}>
									{res.originalname}
								</Button>
							</div>
							<Divider sx={{ my: theme.spacing(2.5) }} />
						</div>
					))}
				</List>
			)}
		</Container>
	);
};

export default CourseResourcesList;
