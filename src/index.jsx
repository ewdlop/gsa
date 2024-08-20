/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';

import {createRoot} from 'react-dom/client';

import * as Sentry from '@sentry/react';

import {isDefined} from 'gmp/utils/identity';

import GSA_VERSION from './version';
import App from './web/app';

import {StyleSheetManager} from 'styled-components';

const config = isDefined(global.config) ? global.config : {};
const {sentryDSN, sentryEnvironment} = config;

Sentry.init({
  attachStacktrace: true,
  dsn: sentryDSN,
  environment: sentryEnvironment,
  enabled: isDefined(sentryDSN),
  release: GSA_VERSION,
});

const root = createRoot(document.getElementById('app'));
root.render(
  <StyleSheetManager enableVendorPrefixes>
    <App />
  </StyleSheetManager>,
);
