import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [
	{
		name: 'Course 1',
		type: 'line',
		data: [40, 80, 117, 100, 120, 22, 119],
	},
	{
		name: 'Course 2',
		type: 'line',
		data: [67, 120, 80, 60, 40, 97, 101],
	},
	{
		name: 'Course 3',
		type: 'line',
		data: [20, 120, 90, 70, 50, 87, 112],
	},
];

export default function AppCourseActivity() {
	const chartOptions = merge(BaseOptionChart(), {
		stroke: { width: 3 },
		plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
		fill: { type: 'fill' },
		labels: ['04/16/2022', '04/17/2022', '04/18/2022', '04/19/2022', '04/20/2022', '04/21/2022', '04/22/2022'],
		xaxis: { type: 'datetime' },
		yaxis: { type: 'number', min: 20, max: 160, tickAmount: 4, title: { text: 'Minutes Active' } },
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (y) => {
					if (typeof y !== 'undefined') {
						return `${y.toFixed(0)} minutes active`;
					}
					return y;
				},
			},
		},
	});

	return (
		<Card>
			<CardHeader title='Courses Activity' subheader='track your activity and become more active!' />
			<Box sx={{ p: 3, pb: 1 }} dir='ltr'>
				<ReactApexChart type='line' series={CHART_DATA} options={chartOptions} height={280} />
			</Box>
		</Card>
	);
}
