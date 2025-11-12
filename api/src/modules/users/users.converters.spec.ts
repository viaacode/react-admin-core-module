import type { Avo } from '@viaa/avo2-types'

import { convertUserInfoToCommonUser } from './users.converters'
import { MOCK_HETARCHIEF_USER } from './users.converters.mock'
import { UserInfoType } from './users.types'

describe('User converter helpers', () => {
	it('should convert HetArchiefUser to CommonUser format', () => {
		const commonUser: Avo.User.CommonUser = convertUserInfoToCommonUser(
			MOCK_HETARCHIEF_USER,
			UserInfoType.HetArchiefUser
		)
		expect(commonUser).toBeDefined()
		expect(commonUser.profileId).toEqual(MOCK_HETARCHIEF_USER.id)
		expect(commonUser.userId).toEqual(MOCK_HETARCHIEF_USER.id)
		expect(commonUser.userGroup.label).toEqual(MOCK_HETARCHIEF_USER.groupName)
		expect(commonUser.organisation.or_id).toEqual(MOCK_HETARCHIEF_USER.organisationId)
		expect(commonUser.organisation.name).toEqual(MOCK_HETARCHIEF_USER.organisationName)
	})
})
