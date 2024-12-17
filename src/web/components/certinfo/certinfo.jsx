/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import DateTime from 'web/components/date/datetime';

import {Col} from 'web/entity/page';

import InfoTable from 'web/components/table/infotable';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

const CertInfo = ({info}) => {
  const {activationTime, expirationTime, issuer, md5_fingerprint} = info;
  return (
    <InfoTable data-testid="cert-info-table">
      <colgroup>
        <Col width="10%" />
        <Col width="90%" />
      </colgroup>
      <TableBody>
        <TableRow data-testid="cert-info-activation-row">
          <TableData data-testid="cert-info-activation-label">{_('Activation')}</TableData>
          <TableData data-testid="cert-info-activation-data">
            {isDefined(activationTime) ? (
              <DateTime date={activationTime} />
            ) : (
              _('N/A')
            )}
          </TableData>
        </TableRow>

        <TableRow data-testid="cert-info-expiration-row">
          <TableData data-testid="cert-info-expiration-label">{_('Expiration')}</TableData>
          <TableData data-testid="cert-info-expiration-data">
            {isDefined(expirationTime) ? (
              <DateTime date={expirationTime} />
            ) : (
              _('N/A')
            )}
          </TableData>
        </TableRow>

        <TableRow data-testid="cert-info-md5-row">
          <TableData data-testid="cert-info-md5-label">{_('MD5 Fingerprint')}</TableData>
          <TableData data-testid="cert-info-md5-data">{md5_fingerprint}</TableData>
        </TableRow>

        <TableRow data-testid="cert-info-issuer-row">
          <TableData data-testid="cert-info-issuer-label">{_('Issuer')}</TableData>
          <TableData data-testid="cert-info-issuer-data">{issuer}</TableData>
        </TableRow>
      </TableBody>
    </InfoTable>
  );
};

CertInfo.propTypes = {
  info: PropTypes.object.isRequired,
};

export default CertInfo;
