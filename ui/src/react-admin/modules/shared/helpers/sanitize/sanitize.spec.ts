import sanitize from 'sanitize-html';
import { SanitizePreset } from './presets';
import { sanitizeHtml } from './index';

describe('sanitize', () => {
	it('Should not remove p style attribute and also leave link alone', () => {
		const originalHtml =
			'<p style="text-align:center">Simpel! Drie <a href="/start" target="_self">stappen</a> naar een geslaagde opdracht:</p>';
		const sanitizedHtml = sanitizeHtml(originalHtml, SanitizePreset.full);
		expect(sanitizedHtml).toEqual(
			'<p style="text-align:center">Simpel! Drie <a target="_self" href="/start">stappen</a> naar een geslaagde opdracht:</p>'
		);
	});

	it('Should remove link', () => {
		const originalHtml =
			'<p style="text-align:center">Simpel! Drie <a href="/start" target="_self">stappen</a> naar een geslaagde opdracht:</p>';
		const sanitizedHtml = sanitizeHtml(originalHtml, SanitizePreset.basic);
		expect(sanitizedHtml).toEqual(
			'<p style="text-align:center">Simpel! Drie stappen naar een geslaagde opdracht:</p>'
		);
	});
});
