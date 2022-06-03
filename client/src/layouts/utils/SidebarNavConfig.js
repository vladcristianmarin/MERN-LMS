import { Box } from '@mui/material';
import Iconify from '../../components/Iconify';

const getIcon = (name) => <Iconify icon={name} width={23} height={23} />;

const generalSidebarConfig = () => {
	return [
		{
			title: 'Home',
			path: '/',
			icon: getIcon('eva:home-outline'),
		},
		{
			title: 'Announcements',
			path: `/announcements`,
			icon: getIcon('eva:award-outline'),
		},
	];
};

const studentSidebarConfig = (userInfo) => {
	return [
		{
			title: 'My Courses',
			path: `/student/courses`,
			icon: getIcon('eva:book-outline'),
		},
		{
			title: 'Schedule',
			path: `/schedule/${userInfo.groupId}`,
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
	];
};

const teacherSidebarConfig = (userInfo) => {
	return [
		{
			title: 'Courses',
			path: `/teacher/courses`,
			icon: getIcon('eva:book-outline'),
		},
		{
			title: 'Groups',
			path: `/grades/${userInfo._id}`,
			icon: getIcon('eva:people-outline'),
		},
		{
			title: 'Exams',
			path: `/exams/create`,
			icon: getIcon('eva:file-text-outline'),
		},
	];
};

const adminSidebarConfig = () => {
	return [
		{
			title: 'Students',
			path: '/admin/students',
			icon: (
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Iconify icon='eva:people-outline' width={20} height={20} />
					<Iconify icon='eva:edit-outline' width={20} height={20} />
				</Box>
			),
		},
		{
			title: 'Teachers',
			path: '/admin/teachers',
			icon: (
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Iconify icon='eva:people-outline' width={20} height={20} />
					<Iconify icon='eva:file-text-outline' width={20} height={20} />
				</Box>
			),
		},
		{
			title: 'Groups',
			path: '/admin/groups',
			icon: getIcon('eva:people-outline'),
		},
		{
			title: 'Courses',
			path: '/admin/courses',
			icon: getIcon('eva:book-outline'),
		},
	];
};

export { generalSidebarConfig, studentSidebarConfig, teacherSidebarConfig, adminSidebarConfig };
