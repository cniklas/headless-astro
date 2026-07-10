import { KIRBY_URL } from 'astro:env/server'
import { formatDate } from './dateTime'
import type { KirbyPage, ContentPage, CalendarPage } from '@/Page.type'

const REST_URL = `${KIRBY_URL}/headless`

const CALENDAR_PAGES: CalendarPage[] = [{ title: 'Ton', slug: 'ton', isHome: false }]

const _fetchFromKirby = async (query = 'pages'): Promise<KirbyPage[]> => {
	const response = await fetch(`${REST_URL}/${query}`)
	if (response.ok) return response.json()

	const error = await response.json()
	throw new Error(`❗ Failed to fetch API for ${query}\nCode: ${error.code}\nMessage: ${error.message}\n`)
}

const pages: ContentPage[] = []
const _getPages = async () => {
	if (pages.length) return pages

	const response = await _fetchFromKirby()
	response.forEach(({ modified, order, renderedContent, slug, tableData, title }, i) => {
		pages.push({
			title,
			content: _processContent({ tableData, renderedContent }),
			modified: formatDate(modified),
			order,
			slug: i === 0 ? '' : slug,
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

export const getCalendarPage = (slug: string) => CALENDAR_PAGES.find(page => page.slug === slug) as CalendarPage

export const buildNavigation = async () => {
	const _pages = await _getPages()
	return [..._pages, ...CALENDAR_PAGES]
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
