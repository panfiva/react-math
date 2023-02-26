import { Fragment } from 'react'
import { FilterList, FilterListItem, SavedQueriesList } from 'react-admin'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const TypeFilter = () => {
	return (
		<Fragment>
			<FilterList label='Category' icon={<FolderOpenIcon />}>
				<FilterListItem label='Admin *' value={{ category: 'admin' }}></FilterListItem>
				<FilterListItem label='NPA' value={{ category: 'npa' }}></FilterListItem>
				<FilterListItem label='Labs' value={{ category: 'labs' }}></FilterListItem>
			</FilterList>
		</Fragment>
	)
}

export const FilterSidebar = () => (
	<Box
		sx={{
			display: {
				xs: 'none',
				sm: 'block',
			},
			order: -1, // display on the left rather than on the right of the list
			width: '15em',
			minWidth: '210px',
			marginRight: '1em',
		}}
	>
		<Card sx={{ px: 1 }}>
			<CardContent sx={{ px: 1 }}>
				<SavedQueriesList />
				<TypeFilter />
			</CardContent>
		</Card>
	</Box>
)
