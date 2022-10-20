import React, { FC } from 'react';

import { AdminConfigManager } from '~core/config';
import { DefaultComponentProps } from '../../types';

const Loader: FC<DefaultComponentProps> = (props) => {
  const componentsConfig = AdminConfigManager.getConfig().components;
  const LoaderComponent =
    componentsConfig?.loader.component ?? (() => <span {...props}>Laden...</span>);

  return <LoaderComponent {...props} />;
};

export default Loader;
