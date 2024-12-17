/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/cve.svg';

const CveIconComponent = withSvgIcon()(Icon);

const CveIcon = props => (
  <CveIconComponent {...props} data-testid="cve-icon" />
);

export default CveIcon;

// vim: set ts=2 sw=2 tw=80:
