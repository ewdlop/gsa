/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/add_to_assets.svg';

const AddToAssetsIconComponent = withSvgIcon()(Icon);

const AddToAssetsIcon = props => (
  <AddToAssetsIconComponent {...props} data-testid="add-to-assets-icon" />
);

export default AddToAssetsIcon;

// vim: set ts=2 sw=2 tw=80:
