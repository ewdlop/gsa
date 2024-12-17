/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import {ShieldCheck as Icon} from 'lucide-react';

import IconWithStrokeWidth from 'web/components/icon/IconWithStrokeWidth';

const VerifyIcon = withSvgIcon()(props => (
  <IconWithStrokeWidth IconComponent={Icon} {...props} data-testid="verify-icon"/>
));

export default VerifyIcon;

// vim: set ts=2 sw=2 tw=80:
