import { Config } from './config';
import { Modules } from './modules';
import { Routes } from './routes';

const Core = {
	config: new Config(),
	modules: new Modules(),
	routes: new Routes(),
};

export default Core;
