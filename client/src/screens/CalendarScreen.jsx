import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	FormControlLabel,
	FormGroup,
	IconButton,
	Modal,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Container } from '@mui/system';

import Iconify from '../components/Iconify';

let eventGuid = 0;

const INITIAL_EVENTS = [
	{
		id: String(eventGuid++),
		start: '2022-07-07T15:30:00',
		title: 'Final Exams',
		allDay: false,
	},
	{
		id: String(eventGuid++),
		start: '2022-07-09',
		title: 'End Of School Years',
		allDay: true,
	},
];

const CalendarScreen = () => {
	const [open, setOpen] = useState(false);
	const [selectedInfo, setSelectedInfo] = useState(null);
	const [allDay, setAllDay] = useState(true);

	const theme = useTheme();

	const EventSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		hour: Yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid hour format. Accepted format: HH:MM'),
	});

	const formik = useFormik({
		initialValues: {
			title: '',
			hour: '',
		},
		validationSchema: EventSchema,
		onSubmit() {
			handleAddEvent();
		},
	});

	const { errors, touched, values, handleReset, handleSubmit, getFieldProps } = formik;

	const renderEventContent = (eventContent) => (
		<Box sx={{ minWidth: '80%', margin: '0 auto' }}>
			<Typography variant='subtitle2'>
				{eventContent.timeText}
				{eventContent.timeText && 'm'}
			</Typography>
			<Typography variant='body2'>{eventContent.event.title}</Typography>
		</Box>
	);

	const handleDateSelect = (selectInfo) => {
		setSelectedInfo(selectInfo);
		setOpen(true);
	};

	const handleEventClick = (clickInfo) => {
		//eslint-disable-next-line
		if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
			clickInfo.event.remove();
		}
	};

	const handleModalClose = () => {
		setOpen(false);
		setSelectedInfo(null);
		setAllDay(true);
		handleReset();
	};

	const handleAddEvent = () => {
		let calendarApi = selectedInfo.view.calendar;
		calendarApi.unselect();

		let start = selectedInfo.startStr;
		if (values.hour) {
			start += `T${values.hour}:00`;
		}

		calendarApi.addEvent({
			id: String(eventGuid++),
			title: values.title,
			start,
			allDay,
		});

		//dispatch(addEvent)
		handleModalClose();
	};

	const handleCheckboxChange = (e) => {
		setAllDay(e.target.checked);
	};

	return (
		<Container maxWidth='xl'>
			<Modal open={open} onClose={handleModalClose}>
				<Card
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '30%',
						bgcolor: theme.palette.background.paper,
						boxShadow: theme.customShadows.z1,
					}}>
					<CardHeader
						title='Add Event'
						action={
							<IconButton onClick={handleModalClose}>
								<Iconify icon='eva:close-outline' />
							</IconButton>
						}
					/>
					<CardContent>
						<FormikProvider value={formik}>
							<Form autoComplete='off' noValidate onSubmit={handleSubmit}>
								<FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
									<TextField
										fullWidth
										autoComplete='off'
										type='text'
										label='Title'
										error={Boolean(touched.title && errors.title)}
										helperText={touched.title && errors.title}
										{...getFieldProps('title')}
									/>
									{!allDay && (
										<TextField
											fullWidth
											autoComplete='off'
											type='text'
											label='Hour'
											placeholder='HH:MM'
											error={Boolean(touched.hour && errors.hour)}
											helperText={touched.hour && errors.hour}
											{...getFieldProps('hour')}
										/>
									)}
									<FormControlLabel
										label='All Day Event?'
										control={<Checkbox checked={allDay} onChange={handleCheckboxChange} />}
									/>
								</FormGroup>
								<Stack direction='row' gap={1.5} justifyContent='flex-end' alignItems='center' sx={{ width: '100%' }}>
									<Button variant='contained' type='submit' onClick={handleAddEvent}>
										ADD
									</Button>
								</Stack>
							</Form>
						</FormikProvider>
					</CardContent>
				</Card>
			</Modal>

			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay',
				}}
				initialView='dayGridMonth'
				editable={true}
				selectable={true}
				selectMirror={true}
				weekends={true}
				initialEvents={INITIAL_EVENTS}
				select={handleDateSelect}
				eventContent={renderEventContent}
				eventClick={handleEventClick}
				dayMaxEvents={true}
				eventAdd={(e) => console.log(e)}
			/>
		</Container>
	);
};

export default CalendarScreen;
