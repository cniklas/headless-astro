const dateFormatter = new Intl.DateTimeFormat('de', {
	// year: 'numeric',
	month: 'long',
	day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('de', {
	hour: 'numeric',
	minute: 'numeric',
})

export const formatDate = (date: string) => {
	const realDate = new Date(date)
	return `${dateFormatter.format(realDate)}, ${timeFormatter.format(realDate)} Uhr`
}
