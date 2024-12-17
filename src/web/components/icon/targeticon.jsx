/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/target.svg';

const TargetIconComponent = withSvgIcon()(Icon);

const TargetIcon = props => (
  <TargetIconComponent {...props} data-testid="target-icon" />
);

export default TargetIcon;

// vim: set ts=2 sw=2 tw=80:
