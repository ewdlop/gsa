/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Icon from './svg/os.svg';
import withSvgIcon from './withSvgIcon';

const OsSvgIconComponent = withSvgIcon()(Icon);

const OsSvgIcon = props => (
  <OsSvgIconComponent {...props} data-testid="os-svg-icon" />
);

export default OsSvgIcon;
