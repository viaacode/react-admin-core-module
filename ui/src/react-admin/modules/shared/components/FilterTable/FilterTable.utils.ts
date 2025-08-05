function getColumnKey(key: string) {
	return `AVO.admin_preferred_columns.${key.replaceAll('/', '_')}`;
}

export function setPreferredColumns(columnKey: string, value: string[]): void {
	localStorage.setItem(getColumnKey(columnKey), JSON.stringify(value));
}

export function getPreferredColumns(columnKey: string): string[] {
	const columns = localStorage.getItem(getColumnKey(columnKey));
	return columns ? JSON.parse(columns) : [];
}
