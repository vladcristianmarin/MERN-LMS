import React from 'react';

import { Button } from '@mui/material';
import {
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
} from '@mui/x-data-grid';

import Iconify from '../Iconify';

const CustomToolbar = ({ refreshHandler, fileName, fields = undefined }) => {
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
				csvOptions={{
					fileName,
					fields,
				}}
			/>
		</GridToolbarContainer>
	);
};

export default CustomToolbar;
