import { Avatar, Card, List, ListItem, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isMyLastMessage, isMySameSender, isSameSender, isSameSenderMargin } from './config/ChatLogic';
import TypingAnimation from './animations/TypingAnimation';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/system';
import { formatDate } from './utils/dateformatting';
import { CURRENT_URL } from '../../constants/extra';

const ScrollableChat = ({ messages, isTyping, typingClient }) => {
	const theme = useTheme();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	return (
		<ScrollableFeed>
			<List>
				{messages?.map((m, i) => (
					<ListItem
						key={i}
						sx={{
							display: 'flex',
							gap: theme.spacing(1),
							p: theme.spacing(0.3, 0.5),
							overflow: 'hidden',
						}}>
						{(isSameSender(messages, m, i, userInfo?._id) || isLastMessage(messages, i, userInfo?._id)) && (
							<Tooltip title={m.sender.name}>
								<Avatar sx={{ bgcolor: theme.palette.primary.main }} src={`${CURRENT_URL}/${m.sender?.avatar}`}>
									{m.sender.name[0]} {m.sender.isAdmin}
								</Avatar>
							</Tooltip>
						)}
						<Card
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								gap: theme.spacing(0.3),
								marginRight: '7px',
								color: theme.palette.text.primary,
								bgcolor: m.sender._id === userInfo?._id ? theme.palette.secondary.light : theme.palette.primary.light,
								boxShadow: m.sender._id === userInfo?._id ? theme.customShadows.secondary : theme.customShadows.primary,
								ml: isSameSenderMargin(messages, m, i, userInfo?._id),
								p: theme.spacing(0.3, 1),
								maxWidth: '75%',
								position: 'relative',
								zIndex: 2,
							}}>
							<Typography>{m.content}</Typography>
							<Typography
								variant='caption'
								sx={{ color: theme.palette.grey[200], fontWeight: 700, alignSelf: 'end', ml: theme.spacing(1) }}>
								{formatDate(m.createdAt)}
							</Typography>
						</Card>
						{(isSameSender(messages, m, i, userInfo?._id) || isLastMessage(messages, i, userInfo?._id)) && (
							<div
								style={{
									width: 0,
									height: 0,
									borderLeft: '5px solid transparent',
									borderRight: '5px solid transparent',
									borderTop: `20px solid ${theme.palette.primary.light}`,
									position: 'absolute',
									top: '20px',
									left: '48px',
									transform: 'rotate(70deg)',
									zIndex: 1,
								}}></div>
						)}
						{(isMySameSender(messages, m, i, userInfo?._id) || isMyLastMessage(messages, i, userInfo?._id)) && (
							<div
								style={{
									marginRight: '5px',
									width: 0,
									height: 0,
									borderLeft: '5px solid transparent',
									borderRight: '5px solid transparent',
									borderTop: `20px solid ${theme.palette.secondary.light}`,
									position: 'absolute',
									top: '15px',
									right: '2px',
									transform: 'rotate(-70deg)',
									zIndex: 1,
								}}></div>
						)}
					</ListItem>
				))}
			</List>

			{isTyping && (
				<Box sx={{ display: 'flex', alignItems: 'center', height: theme.spacing(7), gap: theme.spacing(1) }}>
					<Typography color='text.secondary' variant='body2'>
						{typingClient?.name} is typing
					</Typography>
					<div style={{ width: theme.spacing(3), marginTop: '5px' }}>
						<TypingAnimation />
					</div>
				</Box>
			)}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
