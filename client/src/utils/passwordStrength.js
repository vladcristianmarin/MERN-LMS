const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

const hasMixed = (number) =>
	new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

export const strengthColor = (count, theme) => {
	if (count < 1) return { label: 'Bad', color: theme.palette.error.dark };
	if (count < 2) return { label: 'Poor', color: theme.palette.error.main };
	if (count < 3) return { label: 'Weak', color: theme.palette.warning.dark };
	if (count < 4) return { label: 'Normal', color: theme.palette.warning.main };
	if (count < 5) return { label: 'Good', color: theme.palette.success.dark };
	if (count < 6)
		return { label: 'Strong', color: theme.palette.success.darker };
	return { label: 'Poor', color: theme.palette.error.dark };
};

export const strengthIndicator = (number) => {
	let strengths = 0;
	if (number.length > 5) strengths += 1;
	if (number.length > 7) strengths += 1;
	if (hasNumber(number)) strengths += 1;
	if (hasSpecial(number)) strengths += 1;
	if (hasMixed(number)) strengths += 1;
	return strengths;
};
