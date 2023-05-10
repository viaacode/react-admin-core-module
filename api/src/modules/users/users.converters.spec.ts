import { Avo } from '@viaa/avo2-types';
import { convertUserInfoToCommonUser } from './users.converters';
import { MOCK_HETARCHIEF_USER } from './users.converters.mock';
import { UserInfoType } from './users.types';
import CommonUser = Avo.User.CommonUser;

describe('User converter helpers', () => {
	it('should convert HetArchiefUser to CommonUser format', () => {
		const commonUser: CommonUser = convertUserInfoToCommonUser(
			MOCK_HETARCHIEF_USER,
			UserInfoType.HetArchiefUser
		);
		expect(commonUser).toBeDefined();
		expect(commonUser.profileId).toEqual(MOCK_HETARCHIEF_USER.id);
		expect(commonUser.userId).toEqual(MOCK_HETARCHIEF_USER.id);
		expect(commonUser.userGroup.label).toEqual(MOCK_HETARCHIEF_USER.groupName);
	});
});
