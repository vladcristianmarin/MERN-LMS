import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ButtonBase, Card, Typography } from '@mui/material';
import Iconify from '../Iconify';
import axios from 'axios';
import styled from '@emotion/styled';
import { getMyCourses, getMyGroup } from '../../actions/studentActions';

const ProfileInfoBox = () => {
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.userLogin);
	const { group } = useSelector((state) => state.studentMyGroup);
	const { courses } = useSelector((state) => state.studentMyCourses);
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		const fetchCountries = async () => {
			const { data } = await axios.get('/api/countries');
			setCountries(data);
		};
		fetchCountries();
		dispatch(getMyGroup());
		dispatch(getMyCourses());
	}, [dispatch]);

	const StyledCard = styled(Card)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		gap: theme.spacing(1),
		flex: 1,
		color: theme.palette.text.primary,
		background: theme.palette.primary.lighter,
		padding: theme.spacing(1),
	}));

	const StyledIcon = styled(Iconify)(({ theme }) => ({
		width: 36,
		height: 36,
		borderRadius: '50%',
		color: theme.palette.common.white,
		background: theme.palette.primary.main,
		border: `solid 7px ${theme.palette.primary.main}`,
		marginBottom: theme.spacing(-1),
	}));

	return (
		<Box sx={{ px: '7%' }}>
			<Typography variant='h5' sx={{ textTransform: 'capitalize' }}>
				{userInfo?.name}
			</Typography>
			<Typography variant='body1' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Iconify icon='eva:email-outline' sx={{ width: 18, height: 18 }} />
				<span>{userInfo?.email}</span>
			</Typography>
			<Typography variant='body1' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Iconify icon='eva:pin-outline' sx={{ width: 18, height: 18 }} />
				<span>{countries.filter((country) => country.includes(userInfo?.country))}</span>
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 3, paddingBottom: 3 }}>
				<ButtonBase sx={{ minWidth: '47%', display: 'flex' }}>
					<StyledCard>
						<StyledIcon icon='eva:book-outline' />
						<Typography variant='h4' color='primary.dark'>
							{courses?.length || 0}
						</Typography>
						<Typography variant='body1' color='text.secondary' mt='-10px'>
							Courses
						</Typography>
					</StyledCard>
				</ButtonBase>
				<ButtonBase sx={{ minWidth: '47%', display: 'flex' }}>
					<StyledCard>
						<StyledIcon icon='eva:people-outline' />
						<Typography variant='h4' color='primary.dark'>
							{group?.code || 'None'}
						</Typography>
						<Typography variant='body1' color='text.secondary' mt='-10px'>
							Group
						</Typography>
					</StyledCard>
				</ButtonBase>
			</Box>
		</Box>
	);
};

export default ProfileInfoBox;
