/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';
import {getEntityType} from 'gmp/utils/entitytype';

import PropTypes from 'web/utils/proptypes';
import withUsername from 'web/utils/withUserName';

import Comment from 'web/components/comment/comment';

import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import TableData from 'web/components/table/data';

import ObserverIcon from 'web/entity/icon/observericon';

import {RowDetailsToggle} from './row';

const EntityNameTableData = ({
  entity,
  links = true,
  displayName,
  username,
  type = getEntityType(entity),
  children,
  onToggleDetailsClick,
}) => (
  <TableData flex="column">
    <Layout align="space-between">
      <Layout flex="column">
        {entity.isOrphan() && <b>{_('Orphan')}</b>}
        {isDefined(onToggleDetailsClick) ? (
          <span>
            <RowDetailsToggle name={entity.id} onClick={onToggleDetailsClick}>
              {entity.name}
            </RowDetailsToggle>
            {entity.deprecated && <b> ({_('Deprecated')})</b>}
          </span>
        ) : (
          <span>
            <DetailsLink type={type} id={entity.id} textOnly={!links}>
              {entity.name}
            </DetailsLink>
            {entity.deprecated && <b> ({_('Deprecated')})</b>}
          </span>
        )}
      </Layout>
      <ObserverIcon
        displayName={displayName}
        entity={entity}
        userName={username}
      />
    </Layout>
    {isDefined(entity.comment) && <Comment>({entity.comment})</Comment>}
    {children}
  </TableData>
);

EntityNameTableData.propTypes = {
  displayName: PropTypes.string.isRequired,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  type: PropTypes.string,
  username: PropTypes.string.isRequired,
  onToggleDetailsClick: PropTypes.func,
};

export default withUsername(EntityNameTableData);

// vim: set ts=2 sw=2 tw=80:
