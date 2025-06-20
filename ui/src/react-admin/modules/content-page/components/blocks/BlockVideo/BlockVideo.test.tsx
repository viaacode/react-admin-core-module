import { mount, shallow } from "enzyme";
import React from "react";
import { flowplayerMock } from "../../../../../../__mocks__/flowplayer";

import { BlockVideo } from "./BlockVideo";

const customClass = "c-block-custom";

const blockVideoExampleExample = (
	<BlockVideo className={customClass} flowPlayerProps={flowplayerMock} />
);

describe("<BlockVideo />", () => {
	it("Should be able to render", () => {
		shallow(blockVideoExampleExample);
	});

	it("Should set the correct className", () => {
		const component = mount(blockVideoExampleExample);

		const container = component.find("div").at(0);

		expect(container.hasClass(customClass)).toEqual(true);
		expect(container.hasClass("o-container-vertical")).toEqual(true);
	});
});
