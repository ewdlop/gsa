/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/delta.svg';

const DeltaIconComponent = withSvgIcon()(Icon);

const DeltaIcon = props => (
  <DeltaIconComponent {...props} data-testid="delta-icon" />
);

export default DeltaIcon;

// vim: set ts=2 sw=2 tw=80:
