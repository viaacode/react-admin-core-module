import { Link } from '~modules/shared/components/Link';
import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { stringifyUrl } from 'query-string';

import { useGetNewspaperTitles } from './hooks/useIeObjectsNewspaperTitles';
import type {
	BlockOverviewNewspaperTitlesProps,
	NewspaperTitle,
} from './BlockOverviewNewspaperTitles.types';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { Button } from '@viaa/avo2-components';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import { Icon } from '~shared/components/Icon';
import { TextInput } from '@meemoo/react-components';
import { tText } from '~shared/helpers/translation-functions';

export const BlockOverviewNewspaperTitles: FC<BlockOverviewNewspaperTitlesProps> = ({
	title,
	titleType,
	buttonType,
	buttonLabel,
	buttonAltTitle,
	buttonIcon,
	buttonAction,
}) => {
	const [searchInput, setSearchInput] = useState('');
	const [newspaperData, setNewspaperData] = useState<NewspaperTitle[]>();
	const { data } = useGetNewspaperTitles();

	useEffect(() => {
		setNewspaperData(data);
	}, [data]);

	const onSearch = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') {
			return;
		}
		const filteredData = data?.filter((newsPaper) =>
			newsPaper.title.toLowerCase().includes(searchInput.toLowerCase())
		);
		setNewspaperData(filteredData);
	};

	return (
		<article className="c-newspaper-titles">
			<div className="c-newspaper-titles__heading">
				{
					<BlockHeading className="c-newspaper-titles__heading__title" type={titleType}>
						{title}
					</BlockHeading>
				}
				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							label={buttonLabel}
							type={buttonType}
							renderIcon={buttonIcon ? () => <Icon name={buttonIcon} /> : undefined}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</div>
			<TextInput
				onKeyUp={onSearch}
				value={searchInput}
				placeholder={tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/block-overview-newspaper-titles___zoek-op-titel'
				)}
				iconEnd={
					<div>
						<Icon name="filter" />
					</div>
				}
				onChange={(value: ChangeEvent<HTMLInputElement>) =>
					setSearchInput(value.target.value)
				}
			/>
			<ul className="c-newspaper-titles__list">
				{newspaperData?.map((item: NewspaperTitle) => (
					<li className="c-newspaper-titles__list__item" key={item.title}>
						<Link
							to={stringifyUrl({
								url: '/zoeken',
								query: { zoekterm: item.title },
							})}
						>
							{item.title}
						</Link>
					</li>
				))}
			</ul>
		</article>
	);
};
