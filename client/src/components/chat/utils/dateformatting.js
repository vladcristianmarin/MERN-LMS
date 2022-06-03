const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const fullMoths = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const isToday = (someDate) => {
	const today = new Date();
	return (
		someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
	);
};

function isDateInThisWeek(dt) {
	const todayObj = new Date();
	const todayDate = todayObj.getDate();
	const todayDay = todayObj.getDay();

	const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

	const lastDayOfWeek = new Date(firstDayOfWeek);
	lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

	return dt >= firstDayOfWeek && dt <= lastDayOfWeek;
}

export const formatDate = (someDateTimeStamp) => {
	const dt = new Date(someDateTimeStamp);
	const date = dt.getDate();
	const month = months[dt.getMonth()];
	const dayName = days[dt.getDay()];
	const fullDayName = fullDays[dt.getDay()];
	const diffDays = new Date().getDate() - date;
	const diffMonths = new Date().getMonth() - dt.getMonth();
	const diffYears = new Date().getFullYear() - dt.getFullYear();

	if (isToday(dt)) {
		const hour = dt.getHours();
		const minutes = dt.getMinutes();
		return `${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`;
	}

	if (isDateInThisWeek(dt)) {
		return fullDayName;
	}

	if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
		return 'Today';
	} else if (diffYears === 0 && diffDays === 1) {
		return 'Yesterday';
	} else if (diffYears === 0 && diffDays < -1 && diffDays > -7) {
		return fullDays[dt.getDay()];
	} else if (diffYears >= 1) {
		return `${date} ${month} ${dt.getFullYear()}`;
	} else {
		return `${dayName}, ${date} ${month}`;
	}
};

export const simpleDateFormat = (dateTimestamp) => {
	const dt = new Date(dateTimestamp);
	const date = dt.getDate();
	const month = fullMoths[dt.getMonth()];
	const year = dt.getFullYear();

	return `${date} ${month}, ${year}`;
};
