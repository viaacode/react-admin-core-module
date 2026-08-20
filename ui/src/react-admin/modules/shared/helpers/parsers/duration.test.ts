import { describe, expect, it } from 'vitest';
import { parseDuration, snippetTimeToSeconds } from './duration';

describe('Parsers - duration', () => {
	it('Should parse a duration as a number`', () => {
		expect(parseDuration('00:00:00')).toEqual(0);
		expect(parseDuration('00:00:05')).toEqual(5);
		expect(parseDuration('00:00:20')).toEqual(20);
		expect(parseDuration('00:00:40')).toEqual(40);
		expect(parseDuration('00:00:59')).toEqual(59);
		expect(parseDuration('00:01:00')).toEqual(60);
		expect(parseDuration('00:01:01')).toEqual(61);
		expect(parseDuration('00:02:01')).toEqual(121);
		expect(parseDuration('00:50:00')).toEqual(3000);
		expect(parseDuration('08:20:00')).toEqual(30000);
	});
});

describe('Parsers - snippetTimeToSeconds', () => {
	it('should parse HH:MM:SS', () => {
		expect(snippetTimeToSeconds('00:00:00')).toEqual(0);
		expect(snippetTimeToSeconds('00:00:10')).toEqual(10);
		expect(snippetTimeToSeconds('00:01:30')).toEqual(90);
		expect(snippetTimeToSeconds('01:00:00')).toEqual(3600);
		expect(snippetTimeToSeconds('12:23:12')).toEqual(44592);
		// Hours are unbounded, a recording can be longer than a day
		expect(snippetTimeToSeconds('30:00:00')).toEqual(108000);
	});

	it('should parse MM:SS, with the hours omitted', () => {
		expect(snippetTimeToSeconds('00:00')).toEqual(0);
		expect(snippetTimeToSeconds('01:30')).toEqual(90);
		expect(snippetTimeToSeconds('1:30')).toEqual(90);
		expect(snippetTimeToSeconds('59:59')).toEqual(3599);
	});

	it('should trim surrounding whitespace', () => {
		expect(snippetTimeToSeconds(' 00:01:30 ')).toEqual(90);
	});

	it('should return null for an empty value', () => {
		expect(snippetTimeToSeconds('')).toBeNull();
		expect(snippetTimeToSeconds('   ')).toBeNull();
		expect(snippetTimeToSeconds(undefined)).toBeNull();
		expect(snippetTimeToSeconds(null)).toBeNull();
	});

	it('should return null for an invalid value', () => {
		expect(snippetTimeToSeconds('abc')).toBeNull();
		expect(snippetTimeToSeconds('90')).toBeNull();
		expect(snippetTimeToSeconds('00:60')).toBeNull();
		expect(snippetTimeToSeconds('00:00:60')).toBeNull();
		expect(snippetTimeToSeconds('00:70:00')).toBeNull();
		expect(snippetTimeToSeconds('00:00:00:00')).toBeNull();
		expect(snippetTimeToSeconds('1:2:3:4')).toBeNull();
		expect(snippetTimeToSeconds('00:01:30.500')).toBeNull();
		expect(snippetTimeToSeconds('-00:01:30')).toBeNull();
	});
});
