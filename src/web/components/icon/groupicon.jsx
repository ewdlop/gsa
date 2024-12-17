/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import {Users as Icon} from 'lucide-react';

import IconWithStrokeWidth from 'web/components/icon/IconWithStrokeWidth';

const GroupIcon = withSvgIcon()(props => (
  <IconWithStrokeWidth IconComponent={Icon} {...props} data-testid="group-icon" />
));

export default GroupIcon;

// vim: set ts=2 sw=2 tw=80:
