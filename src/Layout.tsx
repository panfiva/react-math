import { FC, Fragment, useEffect } from 'react'
import {
	Layout,
	CoreLayoutProps,
	useSidebarState,
	Menu as RaMenu,
	DashboardMenuItem,
	MenuItemLink,
	MenuProps,
} from 'react-admin'
import { styled } from '@mui/material/styles'
import { ReactQueryDevtools } from 'react-query/devtools'
import AddCircleIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const Menu = (props: MenuProps) => {
	const [open, setOpen] = useSidebarState()

	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [open])

	return (
		<RaMenu {...props}>
			<DashboardMenuItem onClick={() => setOpen(false)} />
			<MenuItemLink to='/addition' primaryText='Addition' leftIcon={<AddCircleIcon />} />
			<MenuItemLink
				to='/multiplication'
				primaryText='Multiplication'
				leftIcon={<HighlightOffIcon />}
				onClick={() => setOpen(false)}
			/>
		</RaMenu>
	)
}

const StyledLayout = styled(Layout)({
	'.RaLayout-content': {
		paddingBottom: 0,
		paddingLeft: 0, // keep left padding at 0 so that collapsed menu looks correct
		paddingRight: 0,
	},
})

const LayoutComponent: FC<CoreLayoutProps> = (props) => {
	return (
		<Fragment>
			<StyledLayout {...props} menu={Menu} />
			<ReactQueryDevtools initialIsOpen={false} />
		</Fragment>
	)
}

export default LayoutComponent
