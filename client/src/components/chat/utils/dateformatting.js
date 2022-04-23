const months = [
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

const isToday = (someDate) => {
	const today = new Date();
	return (
		someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
	);
};

export const formatDate = (someDate) => {
	const dateToFormat = new Date(someDate);
	if (isToday(dateToFormat)) {
		const hour = dateToFormat.getHours();
		const minutes = dateToFormat.getMinutes();
		return `${hour}:${minutes}`;
	}
	const date = dateToFormat.getDate();
	const year = dateToFormat.getFullYear();
	const monthName = months[dateToFormat.getMonth()];
	const dayName = days[dateToFormat.getDay()];

	return `${dayName}, ${date} ${monthName} ${year}`;
};
