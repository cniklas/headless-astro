export type KirbyPage = {
	id: string
	modified: string
	order: number | null
	renderedContent: string
	slug: string
	tableData: {
		headers: string[]
		rows: string[][]
	} | null
	title: string
}

export type ContentPage = Pick<KirbyPage, 'modified' | 'order' | 'slug' | 'title'> & {
	content: string
	isHome: boolean
}
export type CalendarPage = {
	isHome: boolean
	slug: string
	title: string
}
