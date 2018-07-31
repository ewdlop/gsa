/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import glamorous from 'glamorous';

import _ from 'gmp/locale';

import logger from 'gmp/log';

import {KeyCode} from 'gmp/utils/event';
import {isDefined, isString} from 'gmp/utils/identity';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import {renderSelectItems} from 'web/utils/render';
import withCapabilities from 'web/utils/withCapabilities';
import withGmp from 'web/utils/withGmp';

import Select from 'web/components/form/select';
import TextField from 'web/components/form/textfield';

import DeleteIcon from 'web/components/icon/deleteicon';
import EditIcon from 'web/components/icon/editicon';
import Icon from 'web/components/icon/icon';
import ManualIcon from 'web/components/icon/manualicon';
import NewIcon from 'web/components/icon/newicon';

import Divider from 'web/components/layout/divider';
import IconDivider from 'web/components/layout/icondivider';
import Layout from 'web/components/layout/layout';

import Filter from 'gmp/models/filter';

const log = logger.getLogger('web.powerfilter');

const DEFAULT_FILTER_ID = '0';

const Label = glamorous.label({
  marginRight: '5px',
});

const LeftDivider = glamorous(Divider)({
  marginRight: '5px',
});

class PowerFilter extends React.Component {

  constructor(...args) {
    super(...args);

    const {filter} = this.props;

    this.state = {
      filter: filter,
      userfilter: filter ? filter.toFilterCriteriaString() : '',
      filtername: '',
    };

    this.handleCreateFilter = this.handleCreateFilter.bind(this);
    this.handleNamedFilterChange = this.handleNamedFilterChange.bind(this);
    this.handleUpdateFilter = this.handleUpdateFilter.bind(this);
    this.handleUserFilterKeyPress = this.handleUserFilterKeyPress.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  updateFilter(filter) {
    const {onUpdate} = this.props;

    if (!isDefined(this.state.filter)) {
      // filter hasn't been loaded yet
      return;
    }

    if (onUpdate) {
      onUpdate(filter);
    }

    let userfilter;

    if (isDefined(filter) && isDefined(filter.toFilterCriteriaString)) {
      userfilter = filter.toFilterCriteriaString();
    }
    else if (isString(filter)) {
      userfilter = filter;
    }
    else {
      userfilter = '';
    }

    this.setState({
      filter,
      userfilter,
    });
  }

  updateFromUserFilter() {
    let {userfilter, filter} = this.state;

    filter = Filter.fromString(userfilter, filter);

    this.updateFilter(filter);
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  handleUpdateFilter() {
    this.updateFromUserFilter();
  }

  handleUserFilterKeyPress(event) {
    if (event.keyCode === KeyCode.ENTER) {
      this.updateFromUserFilter();
    }
  }

  handleNamedFilterChange(value) {
    const {filters} = this.props;

    const filter = filters.find(f => f.id === value);

    this.updateFilter(filter);
  }

  handleCreateFilter() {
    let {filter, userfilter = '', filtername = ''} = this.state;

    if (filtername.trim().length === 0) {
      return;
    }

    filter = Filter.fromString(userfilter, filter);

    this.createFilter(filter);
  }

  createFilter(filter) {
    const {filtername = ''} = this.state;
    const {
      createFilterType,
      gmp,
      onError,
      onFilterCreated,
    } = this.props;

    gmp.filter.create({
      term: filter.toFilterString(),
      type: createFilterType,
      name: filtername,
    }).then(response => {
      const {data: result} = response;
      // load new filter
      return gmp.filter.get(result);
    }).then(response => {
      const {data: f} = response;
      this.updateFilter(f);
      this.setState({filtername: ''});

      if (onFilterCreated) {
        onFilterCreated(f);
      }
    }).catch(err => {
      if (isDefined(onError)) {
        onError(err);
      }
      else {
        log.error(err);
      }
    });
  }

  componentWillReceiveProps(props) {
    const {filter, filters} = props;
    const {filter: state_filter} = this.state;

    this.setState({
      filters,
    });

    if (!isDefined(filter)) {
      this.setState({
        filter,
        userfilter: '',
      });
    }
    else if (
      !isDefined(state_filter) ||
      filter.id !== state_filter.id ||
      !filter.equals(this.state.filter)
    ) {
      this.setState({
        filter,
        userfilter: filter.toFilterCriteriaString(),
      });
    }
  }

  render() {
    const {
      userfilter = '',
      filter,
      filtername = '',
    } = this.state;
    const {
      capabilities,
      filters,
      onEditClick,
      onResetClick,
    } = this.props;
    const namedfilterid = isDefined(filter) && isDefined(filter.id) ?
      filter.id : DEFAULT_FILTER_ID;

    const filter_items = renderSelectItems(filters, DEFAULT_FILTER_ID);

    const can_create = capabilities.mayCreate('filter') &&
      filtername.trim().length > 0;

    return (
      <Layout
        flex="column"
        align={['start', 'stetch']}
        className="powerfilter"
      >
        <Layout flex align={['space-between', 'center']}>
          <LeftDivider align={['start', 'center']}>
            <Layout flex align={['start', 'center']}>
              <Label>
                <b>{_('Filter')}</b>
              </Label>
              <TextField
                name="userfilter"
                size="53"
                maxLength="1000"
                value={userfilter}
                onKeyDown={this.handleUserFilterKeyPress}
                onChange={this.handleValueChange}
              />
            </Layout>
            <IconDivider flex align={['start', 'center']}>
              <Icon
                img="refresh.svg"
                title={_('Update Filter')}
                onClick={this.handleUpdateFilter}
              />

              {onResetClick &&
                <DeleteIcon
                  img="delete.svg"
                  title={_('Reset Filter')}
                  active={isDefined(filter)}
                  onClick={isDefined(filter) ? onResetClick : undefined}
                />
              }

              <ManualIcon
                title={_('Help: Powerfilter')}
                page="gui_introduction"
                anchor="powerfilter"
              />

              {onEditClick &&
                <EditIcon
                  title={_('Edit Filter')}
                  active={isDefined(filter)}
                  onClick={isDefined(filter) ? onEditClick : undefined}
                />
              }
            </IconDivider>
          </LeftDivider>
          <Divider align={['end', 'center']}>
            {capabilities.mayCreate('filter') &&
              <TextField
                name="filtername"
                size="10"
                maxLength="80"
                value={filtername}
                onChange={this.handleValueChange}
              />
            }
            {can_create ?
              <NewIcon
                title={_('Create new filter from current term')}
                onClick={this.handleCreateFilter}
              /> :
              <Icon
                img="new_inactive.svg"
                title={_('Please insert a filter name')}
              />
            }
            {capabilities.mayAccess('filters') &&
              <Select
                width="150px"
                items={filter_items}
                value={namedfilterid}
                menuPosition="right"
                onChange={this.handleNamedFilterChange}
              />
            }
          </Divider>
        </Layout>
      </Layout>
    );
  }
}

PowerFilter.propTypes = {
  createFilterType: PropTypes.string,
  filter: PropTypes.filter,
  filters: PropTypes.array,
  onEditClick: PropTypes.func,
  onError: PropTypes.func,
  onFilterCreated: PropTypes.func,
  onResetClick: PropTypes.func,
  onUpdate: PropTypes.func,
};

PowerFilter.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  gmp: PropTypes.gmp.isRequired,
};

export default compose(
  withCapabilities,
  withGmp,
)(PowerFilter);

// vim: set ts=2 sw=2 tw=80: