import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card } from '@mui/material';
import {
	StyledAvatar,
	StyledContainer,
	StyledRightCard,
	StyledRightChildrenCard,
} from './styles/StudentHomeScreenStyles';

import ProfileInfoBox from './components/ProfileInfoBox';

const StudentHomeScreen = () => {
	const { userInfo } = useSelector((state) => state.userLogin);

	return (
		<StyledContainer maxWidth='xl'>
			<Card></Card>
			<StyledRightCard>
				<StyledRightChildrenCard
					id='user-info-card'
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: (theme) => theme.spacing(4),
					}}>
					<Box sx={{ p: 0, position: 'relative' }}>
						<Box
							component='img'
							src='/images/illustration_profile_card_background.jpg'
							alt='Group of people'
							sx={{
								objectFit: 'fill',
								p: 1,
								borderTopLeftRadius: '16px',
								borderTopRightRadius: '16px',
							}}
						/>
						<StyledAvatar variant='square' src={userInfo?.avatar} alt={`${userInfo?.name} profile picture`}>
							{userInfo?.name[0].toUpperCase()}
						</StyledAvatar>
					</Box>
					<ProfileInfoBox />
				</StyledRightChildrenCard>
				<StyledRightChildrenCard>No content idea</StyledRightChildrenCard>
				<StyledRightChildrenCard sx={{ gridColumn: '1 / -1' }}>Schedule / Chart</StyledRightChildrenCard>
			</StyledRightCard>
		</StyledContainer>
	);
};

export default StudentHomeScreen;
