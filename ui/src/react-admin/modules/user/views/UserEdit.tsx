import {
	Button,
	ButtonToolbar,
	Container,
	Flex,
	FlexItem,
	Form,
	FormGroup,
	IconName,
	Select,
	Spacer,
	TagInfo,
	TagsInput,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { compact, get } from 'lodash-es';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Icon } from '~shared/components';
import { AdminLayout } from '../../shared/layouts';
import { UserService } from '../user.service';

import { AdminConfigManager, ToastType } from '~core/config';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { useCompaniesWithUsers } from '~shared/hooks/useCompanies';
import { useSubjects } from '~shared/hooks/useSubjects';
import { useTranslation } from '~shared/hooks/useTranslation';
import { CustomError } from '~shared/helpers/custom-error';
import { navigate } from '~shared/helpers/link';
import FileUpload from '~shared/components/FileUpload/FileUpload';
import { PHOTO_TYPES } from '~shared/helpers/files';
import stringToTagInfo from '../helpers/string-to-tag-info';
import { CommonUser } from '../user.types';
import { getAvatarProps } from '~shared/helpers/formatters/avatar';

export type UserEditProps = {
	id: string;
	onSave?: (newProfileInfo: Partial<Avo.User.Profile>) => void;
	onLoaded?: (user: CommonUser) => void;
};

export const UserEdit: FC<UserEditProps> = ({ id, onSave, onLoaded }) => {
	// Hooks
	const [storedProfile, setStoredProfile] = useState<CommonUser | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [selectedSubjects, setSelectedSubjects] = useState<TagInfo[]>([]);
	const [companies] = useCompaniesWithUsers();
	const [subjects] = useSubjects();
	const [firstName, setFirstName] = useState<string | undefined>();
	const [lastName, setLastName] = useState<string | undefined>();
	const [avatar, setAvatar] = useState<string | undefined>();
	const [title, setTitle] = useState<string | undefined>();
	const [bio, setBio] = useState<string | undefined>();
	const [companyId, setCompanyId] = useState<string | undefined>();

	const { tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const fetchProfileById = useCallback(async () => {
		try {
			const profile = await UserService.getUserById(id);

			setFirstName(profile.firstName);
			setLastName(profile.lastName);
			setAvatar(getAvatarProps(profile).image);
			setTitle(profile.title);
			setBio(profile.bio);
			setCompanyId(profile.companyId);
			setSelectedSubjects((profile.subjects || []).map(stringToTagInfo));

			setStoredProfile(profile);

			onLoaded?.(profile);
		} catch (err) {
			console.error(
				new CustomError('Failed to get user by id', err, {
					query: 'GET_USER_BY_ID',
					variables: {
						id,
					},
				})
			);
			setLoadingInfo({
				state: 'error',
				message: tText(
					'admin/users/views/user-detail___het-ophalen-van-de-gebruiker-info-is-mislukt'
				),
			});
		}
	}, [setStoredProfile, setLoadingInfo, tText, id, onLoaded]);

	useEffect(() => {
		fetchProfileById();
	}, [fetchProfileById]);

	useEffect(() => {
		if (storedProfile) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [storedProfile, setLoadingInfo]);

	const navigateBack = () => {
		navigate(history, AdminConfigManager.getAdminRoute('USER_DETAIL'), {
			id,
		});
	};

	const handleSave = async () => {
		if (!storedProfile) {
			return;
		}

		try {
			setIsSaving(true);

			const newProfileInfo = {
				firstName,
				lastName,
				title,
				bio,
				userId: storedProfile.userId,
				avatar: avatar || null,
				subjects: (selectedSubjects || []).map((item) => item.value.toString()),
				company_id: companyId || null,
			};

			try {
				onSave?.(newProfileInfo);
			} catch (err) {
				setIsSaving(false);
				throw err;
			}

			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.SUCCESS,
				description: tText('admin/users/views/user-edit___de-gebruiker-is-aangepast'),
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to save user', err, {
					storedProfile,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.ERROR,
				description: tText(
					'admin/users/views/user-edit___het-opslaan-van-de-gebruiker-is-mislukt'
				),
			});
		}
		setIsSaving(false);
	};

	const renderUserDetail = () => {
		if (!storedProfile) {
			console.error(
				new CustomError(
					'Failed to load user because render function is called before user was fetched'
				)
			);
			return;
		}

		const companyLogo = get(
			(companies || []).find((company) => company.or_id === companyId),
			'logo_url',
			null
		);
		return (
			<Container mode="vertical" size="small">
				<Container mode="horizontal">
					<Form>
						<FormGroup label={tText('admin/users/views/user-detail___avatar')}>
							{!companyId && (
								<FileUpload
									urls={avatar ? [avatar] : []}
									onChange={(urls) => setAvatar(urls[0])}
									assetType="PROFILE_AVATAR"
									allowMulti={false}
									allowedTypes={PHOTO_TYPES}
									ownerId={id}
								/>
							)}
							{!!companyId && !!companyLogo && (
								<div
									className="c-logo-preview"
									style={{
										backgroundImage: `url(${companyLogo})`,
									}}
								/>
							)}
							{!!companyId && !companyLogo && 'geen avatar'}
						</FormGroup>

						<FormGroup label={tText('admin/users/views/user-detail___voornaam')}>
							<TextInput value={firstName} onChange={setFirstName} />
						</FormGroup>
						<FormGroup label={tText('admin/users/views/user-detail___achternaam')}>
							<TextInput value={lastName} onChange={setLastName} />
						</FormGroup>
						<FormGroup label={tText('admin/users/views/user-detail___functie')}>
							<TextInput value={title} onChange={setTitle} />
						</FormGroup>
						<FormGroup label={tText('admin/users/views/user-detail___bio')}>
							<TextArea value={bio} onChange={setBio} />
						</FormGroup>
						<FormGroup label={tText('admin/users/views/user-detail___vakken')}>
							<TagsInput
								id="subjects"
								placeholder={tText(
									'admin/users/views/user-edit___selecteer-de-vakken-die-deze-gebruiker-geeft'
								)}
								options={(subjects || []).map(stringToTagInfo)}
								value={selectedSubjects}
								onChange={(selectedValues) =>
									setSelectedSubjects(selectedValues || [])
								}
							/>
						</FormGroup>
						<FormGroup label={tText('admin/users/views/user-detail___bedrijf')}>
							<Flex>
								<FlexItem>
									<Select
										options={compact(
											(companies || []).map((org) => {
												if (!org.name || !org.or_id) {
													return null;
												}

												return {
													label: org.name,
													value: org.or_id,
												};
											})
										)}
										value={companyId}
										onChange={setCompanyId}
										clearable
									/>
								</FlexItem>
								<FlexItem shrink>
									<Spacer margin="left">
										<Button
											type="danger"
											size="large"
											ariaLabel={tText(
												'admin/users/views/user-edit___verbreek-de-link-tussen-deze-gebruiker-en-dit-bedrijf'
											)}
											icon={IconName.delete}
											onClick={() => setCompanyId(undefined)}
										/>
									</Spacer>
								</FlexItem>
							</Flex>
						</FormGroup>
					</Form>
				</Container>
			</Container>
		);
	};

	const renderUserDetailPage = () => {
		const Link = AdminConfigManager.getConfig().services.router.Link;
		return (
			<AdminLayout pageTitle={tText('admin/users/views/user-edit___bewerk-gebruiker')}>
				<AdminLayout.Back>
					<Link to={AdminConfigManager.getAdminRoute('USER_OVERVIEW')}>
						<Button type="borderless">
							<Icon name="chevronLeft"></Icon>
						</Button>
					</Link>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/user-groups/views/user-group-edit___annuleer')}
							onClick={navigateBack}
							type="tertiary"
						/>
						<Button
							disabled={isSaving}
							label={tText('admin/user-groups/views/user-group-edit___opslaan')}
							onClick={handleSave}
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>

				<AdminLayout.Content>{renderUserDetail()}</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<LoadingErrorLoadedComponent
				loadingInfo={loadingInfo}
				dataObject={storedProfile}
				render={renderUserDetailPage}
			/>
		</>
	);
};
