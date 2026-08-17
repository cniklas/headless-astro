import { KIRBY_URL } from 'astro:env/server'
import { formatDate } from './dateTime'
import type { KirbyPage, ContentPage } from '@/Page.type'

const ERROR_PAGE: KirbyPage = {
	id: 'error',
	lastEditor: null,
	modified: new Date().toISOString(),
	order: null,
	renderedContent: '',
	slug: 'error',
	tableData: null,
	title: 'Error',
}

const _fetchFromKirby = async (query = 'pages'): Promise<KirbyPage[]> => {
	try {
		const response = await fetch(`${KIRBY_URL}/headless/${query}`)
		if (response.ok) return response.json()

		throw new Error('❌ Failed to fetch Kirby API', { cause: response })
	} catch (error) {
		console.error(error)

		const { cause } = error as { cause: Response }
		return [{ ...ERROR_PAGE, title: `${cause.status} ${cause.statusText}` }]
	}
}

const pages: ContentPage[] = []
const _getPages = async () => {
	if (pages.length) return pages

	const response = await _fetchFromKirby()
	response.forEach(({ lastEditor, modified, order, renderedContent, slug, tableData, title }, i) => {
		pages.push({
			title,
			content: _processContent({ tableData, renderedContent }),
			modified: formatDate(modified),
			lastEditor,
			order,
			slug: i === 0 ? '/' : slug,
			isHome: i === 0,
		})
	})
	// pages.sort((a, b) => (a.isHome ? -1 : b.isHome ? 1 : (a.order ?? Infinity) - (b.order ?? Infinity)))

	return pages
}

export const getHomePage = async () => {
	const pages = await _getPages()
	return pages.find(page => page.isHome) as ContentPage
}

export const getAllExceptHomePage = async () => {
	const pages = await _getPages()
	return pages.filter(page => !page.isHome)
}

const CALENDAR_PAGES = { ton: { title: 'Ton', slug: 'ton', isHome: false } } as const
export const getCalendarPage = (key: keyof typeof CALENDAR_PAGES) => CALENDAR_PAGES[key]

export const buildNavigation = async () => {
	const _pages = await _getPages()
	return [..._pages, ...Object.values(CALENDAR_PAGES)]
}

const _processContent = ({ tableData, renderedContent }: Pick<KirbyPage, 'renderedContent' | 'tableData'>) => {
	if (!tableData) return renderedContent

	const columnLabels = tableData.headers.map(data => data.trim())
	const tableHeader = tableData.headers
		// a11y: table headers should not comtain empty `<th>` elements
		.map(data => (data ? `<th scope="col">${data.trim()}</th>` : '<td></td>'))
		.join(' ')

	const tableBody = tableData.rows
		.map(row => {
			const cells = row
				.map((data, i) => {
					// replace three hyphens with an em dash like WordPress does
					if (data === '---') data = '—'

					const label = columnLabels.at(i)
					if (!label) return `<th scope="row">${data}</th>`
					return `<td data-th="${label}">${data}</td>`
				})
				.join(' ')
			return `<tr> ${cells} </tr>`
		})
		.join(' ')

	return `
		${renderedContent}

		<div class="table-wrapper">
			<table>
				<thead>
					<tr> ${tableHeader} </tr>
				</thead>
				<tfoot aria-hidden="true">
					<tr> ${tableHeader} </tr>
				</tfoot>
				<tbody>
					${tableBody}
				</tbody>
			</table>
		</div>
	`
}
