import { GraphQlQueryDto } from './graphql-query.dto';

describe('GraphQlQueryDto', () => {
	describe('GraphQlQueryDto', () => {
		it('should be able to construct a GraphQlQueryDto object', async () => {
			const graphQlQueryDto = new GraphQlQueryDto();
			expect(graphQlQueryDto).toEqual({});
		});
	});
});
