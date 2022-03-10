import countries from '../data/countries.js';

//* @description    Get all countires list
//* @route          GET /api/countries
//* @access         Public

export const getCountries = (_req, res) => {
	res.send(countries.map((country) => country.emoji + ' ' + country.name));
};
