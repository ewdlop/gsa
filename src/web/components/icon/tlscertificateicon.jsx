/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import withSvgIcon from './withSvgIcon';

import Icon from './svg/tlscertificate.svg';

const TlsCertificateIconComponent = withSvgIcon()(Icon);

const TlsCertificateIcon = props => (
  <TlsCertificateIconComponent {...props} data-testid="tls-certificate-icon" />
);

export default TlsCertificateIcon;

// vim: set ts=2 sw=2 tw=80:
