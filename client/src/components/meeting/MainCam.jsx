import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

const Video = styled('video')(() => ({
	width: '100%',
	maxHeight: '55vh',
	transform: 'rotateY(180deg)',
	borderRadius: '3px',
	objectFit: 'cover',
}));

const MainCam = ({ myVideoStream, user }) => {
	const videoRef = useRef(null);
	const theme = useTheme();

	useEffect(() => {
		if (myVideoStream) {
			videoRef.current.srcObject = myVideoStream;
			videoRef.current.addEventListener('loadedmetadata', () => {
				videoRef.current.play();
			});
		}
	}, [myVideoStream]);
	return (
		<Paper sx={{ bgcolor: theme.palette.background.neutral, position: 'relative' }}>
			<Video muted ref={videoRef} autoPlay playsInline />
			<Typography
				variant='subtitle1'
				sx={{
					color: theme.palette.primary.contrastText,
					position: 'absolute',
					top: '5px',
					left: '5px',
				}}>
				{user.name}
			</Typography>
		</Paper>
	);
};

export default MainCam;
