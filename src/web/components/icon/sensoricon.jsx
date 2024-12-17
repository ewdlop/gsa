/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/sensor.svg';

const SensorIconComponent = withSvgIcon()(Icon);

const SensorIcon = props => (
  <SensorIconComponent {...props} data-testid="sensor-icon" />
);

export default SensorIcon;

// vim: set ts=2 sw=2 tw=80:
