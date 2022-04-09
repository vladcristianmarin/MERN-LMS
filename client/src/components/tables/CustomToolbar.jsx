import React from 'react';

import { Button, CircularProgress } from '@mui/material';
import {
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
} from '@mui/x-data-grid';

import Iconify from '../Iconify';

const CustomToolbar = ({ refreshHandler, fileName, fields = undefined, loading = false }) => {
	return (
		<GridToolbarContainer>
			<Button onClick={refreshHandler}>
				<Iconify icon='eva:refresh-outline' sx={{ mr: '8px', ml: '-2px', height: 18, width: 18 }} />
				Refresh
			</Button>
			<GridToolbarFilterButton />
			<GridToolbarColumnsButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport
				sx={{ mr: 'auto' }}
				csvOptions={{
					fileName,
					fields,
				}}
			/>
			{loading && <CircularProgress sx={{ p: 0.5 }} />}
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
