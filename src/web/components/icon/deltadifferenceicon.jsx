/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/delta_second.svg';

const DeltaDifferenceIconComponent = withSvgIcon()(Icon);

const DeltaDifferenceIcon = props => (
  <DeltaDifferenceIconComponent {...props} data-testid="delta-difference-icon" />
);

export default DeltaDifferenceIcon;

// vim: set ts=2 sw=2 tw=80:
