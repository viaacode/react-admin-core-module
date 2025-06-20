import type { ButtonAction, ButtonProps } from "@viaa/avo2-components";

export type RichTextButton = ButtonProps & {
	buttonAction: ButtonAction;
	buttonIconAlignment?: "left" | "right";
};
