import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigValue } from './config.types';

export default class Config {
	private dataSubject = new BehaviorSubject<ConfigValue>({});
	public value = this.dataSubject.value;

	public add(data: ConfigValue): void {
		this.dataSubject.next({
			...this.dataSubject.getValue(),
			...data,
		});
	}

	public selectValue<K extends keyof ConfigValue>(
		key?: K
	): Observable<ConfigValue[K] | ConfigValue> {
		if (key) {
			return this.dataSubject.asObservable().pipe(map((config) => config?.[key]));
		}
		return this.dataSubject.asObservable();
	}

	public getValue<K extends keyof ConfigValue>(key: K): ConfigValue[K] | ConfigValue {
		if (key) {
			return this.dataSubject.getValue()[key];
		}

		return this.dataSubject.getValue();
	}
}
