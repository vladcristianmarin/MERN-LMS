import Iconify from '../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={23} height={23} />;

const sidebarConfig = (userInfo) => [
	{
		title: 'Home',
		path: '/',
		icon: getIcon('eva:home-outline'),
	},
	{
		title: 'Schedule',
		path: `/schedule/${userInfo._id}`,
		icon: getIcon('eva:calendar-outline'),
	},
	{
		title: 'Grades',
		path: `/grades/${userInfo._id}`,
		icon: getIcon('eva:edit-2-outline'),
	},
	{
		title: 'Exams',
		path: `/exams/${userInfo.groupId}`,
		icon: getIcon('eva:file-text-outline'),
	},
	{
		title: 'Announcements',
		path: `/announcements`,
		icon: getIcon('eva:award-outline'),
	},
];

export default sidebarConfig;
