import type { DefaultProps } from "@viaa/avo2-components";
import {
	Button,
	Column,
	Container,
	convertToHtml,
	Grid,
	Image,
	Spacer,
} from "@viaa/avo2-components";
import clsx from "clsx";
import type { FunctionComponent, ReactNode } from "react";

import "./BlockImageTitleTextButton.scss";
import Html from "~shared/components/Html/Html";

export interface BlockImageTitleTextButtonProps extends DefaultProps {
	imageSource: string;
	imageDescription?: string;
	title?: ReactNode | string;
	subtitle?: ReactNode | string;
	text?: ReactNode | string;
	buttonLabel?: string;
	onClick?: () => void;
}

export const BlockImageTitleTextButton: FunctionComponent<
	BlockImageTitleTextButtonProps
> = ({
	className,
	imageSource,
	imageDescription,
	title = "",
	subtitle = "",
	text = "",
	buttonLabel,
	onClick,
}) => {
	const renderText = (text: string | ReactNode, className?: string) => {
		if (text) {
			if (typeof text === "string") {
				return (
					<Html
						content={convertToHtml(text as string)}
						className={className}
					></Html>
				);
			}
			return text;
		}
		return null;
	};

	return (
		<Container
			className={clsx("c-block-image-title-text-button", className)}
			mode="vertical"
		>
			<Container mode="horizontal">
				<Grid>
					<Column size="2-4">
						<Image src={imageSource} alt={imageDescription} />
					</Column>
					<Column size="2-8">
						<div className="c-content">
							{title && <h2>{title}</h2>}
							{renderText(subtitle, "a-subtitle")}
							{renderText(text)}
							{buttonLabel && (
								<Spacer margin="top">
									<Button
										label={buttonLabel}
										type="secondary"
										onClick={() => onClick?.()}
									/>
								</Spacer>
							)}
						</div>
					</Column>
				</Grid>
			</Container>
		</Container>
	);
};
