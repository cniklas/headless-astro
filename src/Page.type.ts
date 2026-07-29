export type KirbyPage = {
	id: string
	lastEditor: string | null
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

export type ContentPage = Pick<KirbyPage, 'lastEditor' | 'modified' | 'order' | 'slug' | 'title'> & {
	content: string
	isHome: boolean
}

export type CalendarPage = {
	isHome: false
	slug: string
	title: string
}
