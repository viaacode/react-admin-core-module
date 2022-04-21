import React, { FC } from 'react';

import { Config } from '~core/config';
import { DefaultComponentProps } from '../../types';

const Loader: FC<DefaultComponentProps> = (props) => {
  const componentsConfig = Config.getConfig().components;
  const LoaderComponent =
    componentsConfig?.loader.component ?? (() => <span {...props}>Laden...</span>);

  return <LoaderComponent {...props} />;
};

export default Loader;
