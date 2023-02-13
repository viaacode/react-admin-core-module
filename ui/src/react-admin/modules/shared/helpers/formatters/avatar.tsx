import { Avatar, AvatarProps } from '@viaa/avo2-components';
import React, { ReactNode } from 'react';
import { CommonUser } from '~modules/user/user.types';

export const getInitialChar = (value: string | undefined | null): string => (value ? value[0] : '');

export const getInitials = (user: CommonUser): string =>
	getInitialChar(user.firstName) + getInitialChar(user.lastName);

export const getFullName = (
	user: CommonUser,
	includeCompany: boolean,
	includeEmail: boolean
): string | null => {
	const firstName = user.firstName;
	const lastName = user.lastName;
	const fullName = user.fullName || `${firstName} ${lastName}`;
	const email = includeEmail ? user.email : '';
	const organisationName = includeCompany ? user.organisation?.name : '';

	return `${fullName}${organisationName ? ` (${organisationName})` : ''}${
		includeEmail ? ` (${email})` : ''
	}`;
};

export const getAbbreviatedFullName = (user: CommonUser): string =>
	`${(user.firstName || '')[0]}. ${user.lastName || ''}`;

export const getAvatarImage = (user: CommonUser): string =>
	user.organisation?.logo_url || user?.avatar || '';

export const getAvatarProps = (
	user: CommonUser,
	options: {
		small?: boolean;
		abbreviatedName?: boolean;
	} = {}
): AvatarProps => {
	const name: string = options.abbreviatedName
		? getAbbreviatedFullName(user)
		: getFullName(user, true, false) || '';

	return {
		name,
		...(options.small ? { size: 'small' } : {}),
		image: getAvatarImage(user),
		initials: getInitials(user),
	};
};

export const renderAvatar = (
	user?: CommonUser,
	options: {
		small?: boolean;
		abbreviatedName?: boolean;
		dark?: boolean;
	} = {}
): ReactNode | null => {
	if (!user) return;

	const props: AvatarProps = getAvatarProps(user, options);

	return <Avatar dark={options.dark} {...props} />;
};
