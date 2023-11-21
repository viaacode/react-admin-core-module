import type { Avo } from '@viaa/avo2-types';

export const ALL_EDUCATION_LOMS: Avo.Lom.LomField[] = [
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/basiseducatie',
		label: 'basiseducatie',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/volwassenenonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/basisonderwijs',
		label: 'basisonderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-basisonderwijs',
		label: 'buitengewoon basisonderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-kleuteronderwijs',
		label: 'buitengewoon kleuteronderwijs',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-basisonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-lager-onderwijs',
		label: 'buitengewoon lager onderwijs',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-basisonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-1e-graad',
		label: 'buitengewoon secundair 1e graad',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-4',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-2e-graad',
		label: 'buitengewoon secundair 2e graad',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-4',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-3e-graad',
		label: 'buitengewoon secundair 3e graad',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-4',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-3e-graad-3e-leerjaar',
		label: 'buitengewoon secundair 3e graad 3e leerjaar',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-4',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
		label: 'buitengewoon secundair onderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-1',
		label: 'buitengewoon secundair opleidingsvorm 1',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-2',
		label: 'buitengewoon secundair opleidingsvorm 2',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-3',
		label: 'buitengewoon secundair opleidingsvorm 3',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-opleidingsvorm-4',
		label: 'buitengewoon secundair opleidingsvorm 4',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/buitengewoon-secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/deeltijds-kunstonderwijs',
		label: 'deeltijds kunstonderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/hoger-onderwijs',
		label: 'hoger onderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-3-jaar-of-jonger',
		label: 'kleuter 3 jaar of jonger',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuteronderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-4-jaar',
		label: 'kleuter 4 jaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuteronderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuter-5-jaar',
		label: 'kleuter 5 jaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuteronderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/kleuteronderwijs',
		label: 'kleuteronderwijs',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/basisonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-graad',
		label: 'lager 1e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-leerjaar',
		label: 'lager 1e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-2e-graad',
		label: 'lager 2e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-2e-leerjaar',
		label: 'lager 2e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-3e-graad',
		label: 'lager 3e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-3e-leerjaar',
		label: 'lager 3e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-4e-leerjaar',
		label: 'lager 4e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-5e-leerjaar',
		label: 'lager 5e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-6e-leerjaar',
		label: 'lager 6e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-onderwijs',
		label: 'lager onderwijs',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/basisonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad',
		label: 'secundair 1e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad-a-stroom',
		label: 'secundair 1e graad a-stroom',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad-b-stroom',
		label: 'secundair 1e graad b-stroom',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-leerjaar',
		label: 'secundair 1e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		label: 'secundair 2e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-arbeidsmarkt',
		label: 'secundair 2e graad finaliteit arbeidsmarkt',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-arbeidsmarkt-bso',
		label: 'secundair 2e graad finaliteit arbeidsmarkt bso',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-arbeidsmarkt',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom',
		label: 'secundair 2e graad finaliteit doorstroom',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom-aso',
		label: 'secundair 2e graad finaliteit doorstroom aso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom-kso',
		label: 'secundair 2e graad finaliteit doorstroom kso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom-tso',
		label: 'secundair 2e graad finaliteit doorstroom tso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel',
		label: 'secundair 2e graad dubbele finaliteit',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel-kso',
		label: 'secundair 2e graad dubbele finaliteit kso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel-tso',
		label: 'secundair 2e graad dubbele finaliteit tso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-leerjaar',
		label: 'secundair 2e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		label: 'secundair 3e graad',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar',
		label: 'secundair 3e graad 3e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar-arbeidsmarkt',
		label: 'secundair 3e graad 3e leerjaar finaliteit arbeidsmarkt',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar-arbeidsmarkt-bso',
		label: 'secundair 3e graad 3e leerjaar finaliteit arbeidsmarkt bso',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar-arbeidsmarkt',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-arbeidsmarkt',
		label: 'secundair 3e graad finaliteit arbeidsmarkt',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-arbeidsmarkt-bso',
		label: 'secundair 3e graad finaliteit arbeidsmarkt bso',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-arbeidsmarkt',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom',
		label: 'secundair 3e graad finaliteit doorstroom',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom-aso',
		label: 'secundair 3e graad finaliteit doorstroom aso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom-kso',
		label: 'secundair 3e graad finaliteit doorstroom kso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom-tso',
		label: 'secundair 3e graad finaliteit doorstroom tso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel',
		label: 'secundair 3e graad dubbele finaliteit',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel-kso',
		label: 'secundair 3e graad dubbele finaliteit kso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel-tso',
		label: 'secundair 3e graad dubbele finaliteit tso',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-leerjaar',
		label: 'secundair 3e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-4e-leerjaar',
		label: 'secundair 4e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-5e-leerjaar',
		label: 'secundair 5e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-6e-leerjaar',
		label: 'secundair 6e leerjaar',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-7e-leerjaar',
		label: 'secundair 7e leerjaar',
		broader:
			'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-3e-leerjaar',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs',
		label: 'secundair onderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-volwassenenonderwijs',
		label: 'secundair volwassenenonderwijs',
		broader: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/volwassenenonderwijs',
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
	{
		id: 'https://w3id.org/onderwijs-vlaanderen/id/structuur/volwassenenonderwijs',
		label: 'volwassenenonderwijs',
		broader: null,
		scheme: 'https://w3id.org/onderwijs-vlaanderen/id/structuur',
	},
];
