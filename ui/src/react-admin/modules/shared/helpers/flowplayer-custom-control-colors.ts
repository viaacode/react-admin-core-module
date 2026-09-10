import type { FlowPlayerControlsColors } from '@meemoo/react-components';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import { isAvo } from '~shared/helpers/is-avo.ts';

export const getFlowPlayerCustomControlColors = (): FlowPlayerControlsColors =>
	isAvo() ? FLOWPLAYER_CUSTOM_CONTROL_COLORS_AVO() : FLOWPLAYER_CUSTOM_CONTROL_COLORS_HET_ARCHIEF();

export const FLOWPLAYER_CUSTOM_CONTROL_COLORS_HET_ARCHIEF = (): FlowPlayerControlsColors => ({
	backgroundColor: Color.Black,
	foregroundColor: Color.White,
	progressColor: Color.OceanGreen,
	progressTrackHoverColor: Color.Ink,
	cuepointColor: Color.SeaGreen,
	buttonTextColor: Color.White,
	buttonFocusColor: Color.OceanGreen,
	buttonHoverColor: Color.Shadow,
	buttonPressedColor: Color.TealExtraDark,
	activeButtonColor: Color.Jade,
	activeButtonTextColor: Color.White,
	activeButtonHoverColor: Color.Shadow,
	activeButtonPressedColor: Color.TealExtraDark,
});

export const FLOWPLAYER_CUSTOM_CONTROL_COLORS_AVO = (): FlowPlayerControlsColors => ({
	backgroundColor: Color.Black,
	foregroundColor: Color.White,
	progressColor: Color.TealBright,
	progressTrackHoverColor: Color.Ink,
	cuepointColor: Color.TealBright,
	buttonTextColor: Color.White,
	buttonFocusColor: Color.TealBright,
	buttonHoverColor: Color.Ink,
	buttonPressedColor: Color.Ink,
	activeButtonColor: Color.Gray500,
	activeButtonTextColor: Color.White,
	activeButtonHoverColor: Color.TealBright,
	activeButtonPressedColor: Color.TealBright,
});
