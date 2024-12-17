/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/result.svg';

const ResultIconComponent = withSvgIcon()(Icon);

const ResultIcon = props => (
  <ResultIconComponent {...props} data-testid="result-icon" />
);

export default ResultIcon;

// vim: set ts=2 sw=2 tw=80:
