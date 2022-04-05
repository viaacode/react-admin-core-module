export {};
// import { useEffect, useState } from 'react';
//
// import Core from '../../../core';
// import { ConfigValue } from 'core/config';
//
// export const useConfig = <Key extends keyof ConfigValue>(key: Key) => {
// 	const [configValue, setConfigValue] = useState<ConfigValue[Key]>();
//
// 	useEffect(() => {
// 		const sub = Core.config.getConfig(key).subscribe((nextConfig) => {
// 			setConfigValue(nextConfig as ConfigValue[Key]);
// 		});
//
// 		return () => {
// 			sub.unsubscribe();
// 		};
// 	}, [key]);
//
// 	return configValue as ConfigValue[Key];
// };
