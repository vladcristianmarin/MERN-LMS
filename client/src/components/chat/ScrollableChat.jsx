import { Avatar, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './config/ChatLogic';

const ScrollableChat = ({ messages }) => {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m, i) => (
					<div style={{ display: 'flex' }} key={m._id}>
						{(isSameSender(messages, m, i, userInfo._id) || isLastMessage(messages, i, userInfo._id)) && (
							<Tooltip title={m.sender.name}>
								<Avatar src={m.sender.pic}>{m.sender.name[0]}</Avatar>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${m.sender._id === userInfo._id ? '#BEE3F8' : '#B9F5D0'}`,
								marginLeft: isSameSenderMargin(messages, m, i, userInfo._id),
								marginTop: isSameUser(messages, m, i, userInfo._id) ? 3 : 10,
								borderRadius: '20px',
								padding: '5px 15px',
								maxWidth: '75%',
							}}>
							{m.content}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
