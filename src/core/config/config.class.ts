import { BehaviorSubject, Observable, skip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigValue } from './config.types';

export default class Config {
	private dataSubject = new BehaviorSubject<ConfigValue | null>(null);
	private observable = this.dataSubject.asObservable().pipe(skip(1));
	public value = this.dataSubject.value;

	public setConfig(data: ConfigValue): void {
		this.dataSubject.next({
			...this.dataSubject.getValue(),
			...data,
		});
	}

	public getConfig<K extends keyof ConfigValue>(
		key?: K
	): Observable<ConfigValue[K] | ConfigValue> {
		if (key) {
			return this.observable.pipe(map((config) => (config as ConfigValue)[key]));
		}
		return this.observable as Observable<ConfigValue>;
	}

	// public getValue<K extends keyof ConfigValue>(key: K): Promise<ConfigValue[K] | ConfigValue> {
	// 	if (key) {
	// 		return this.dataSubject.getValue()[key];
	// 	}
	//
	// 	return this.dataSubject.getValue();
	// }
}
