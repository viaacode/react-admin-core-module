export const VALID_MIME_TYPES: string[] = [
	// images
	'image/png',
	'image/gif',
	'image/jpeg',
	'image/jpeg',
	'image/svg+xml',
	'image/bmp',
	'image/webp',
	// videos
	'video/mp4',
	'video/webm',
	'video/ogg',
	// audio
	'audio/wav',
	'audio/mpeg',
	'audio/midi',
	'audio/x-midi',
	// subtitles
	'text/srt',
	'image/vnd.dvb.subtitle',
	// txt
	'text/plain',
	// pdf
	'application/pdf',
	// word
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessing',
	// excel
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	// csv
	'text/csv',
	// ppt
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	// zip
	'application/zip',
	'application/vnd.rar',
	'application/x-7z-compressed',
	'application/x-tar',
]

export const OPTIMIZE_INTO_WEBP_FORMATS: string[] = [
	'image/png',
	'image/gif',
	'image/jpeg',
	'image/jpeg',
	'image/bmp',
]

export const EXTENSION_TO_MIME_TYPE: Record<string, string> = {
	// images
	png: 'image/png',
	gif: 'image/gif',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	svg: 'image/svg+xml',
	bmp: 'image/bmp',
	webp: 'image/webp',
	// videos
	mp4: 'video/mp4',
	webm: 'video/webm',
	ogg: 'video/ogg',
	// audio
	wav: 'audio/wav',
	mp3: 'audio/mpeg',
	midi: 'audio/midi',
	mid: 'audio/x-midi',
	// subtitles
	srt: 'text/srt',
	sub: 'image/vnd.dvb.subtitle',
	// txt
	txt: 'text/plain',
	// pdf
	pdf: 'application/pdf',
	// word
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessing',
	// excel
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	// csv
	csv: 'text/csv',
	// ppt
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	// zip
	zip: 'application/zip',
	rar: 'application/vnd.rar',
	'7z': 'application/x-7z-compressed',
	tar: 'application/x-tar',
}
