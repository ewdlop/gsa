/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 - 2018 Greenbone Networks GmbH
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

import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import logger from 'gmp/log';

import CancelToken from 'gmp/cancel';

import {isDefined} from 'gmp/utils/identity';

import withDownload from 'web/components/form/withDownload';

import {renewSessionTimeout} from 'web/store/usersettings/actions';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

import withDialogNotification from 'web/components/notification/withDialogNotifiaction'; // eslint-disable-line max-len

import TagsHandler from './tagshandler';

const log = logger.getLogger('web.entity.container');

export const loader = (type, filter_func, name = type) =>
  function(id, cancel_token) {
    const {gmp} = this.props;

    log.debug('Loading', name, 'for entity', id);

    return gmp[type].getAll({
      filter: filter_func(id),
    }, {cancel_token}).then(response => {

      log.debug('Loaded', name, response);

      const {meta} = response;

      this.setState({
        [name]: {
          counts: meta.counts,
          entities: response.data,
        },
      });

      if (meta.fromcache && meta.dirty) {
        log.debug('Forcing reload of', name, meta.dirty);
        return true;
      }

      return false;
    }).catch(err => {
      if (isDefined(err.isCancel) && err.isCancel()) {
        return;
      }
      // call handleError before setting state. setting state may hide the root
      // error
      const rej = this.handleError(err);
      this.setState({[name]: undefined});
      return rej;
    });
  };

// load permissions assigned to the entity as resource
export const permissions_resource_loader = loader('permissions',
  id => 'resource_uuid=' + id);

// load permissions assigned for the entity as subject or resource but not
// permissions with empty resources
export const permissions_subject_loader = loader('permissions',
  id => 'subject_uuid=' + id + ' and not resource_uuid=""' +
    ' or resource_uuid=' + id);

class EntityContainer extends React.Component {

  constructor(...args) {
    super(...args);

    const {name} = this.props;
    const {gmp} = this.props;

    this.entity_command = gmp[name];

    this.state = {
      loading: true,
    };

    this.reload = this.reload.bind(this);

    this.handleChanged = this.handleChanged.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.load(id);
  }

  componentWillUnmount() {
    this.cancelLoading();
  }

  componentWillReceiveProps(next) {
    const {id} = this.props.match.params;
    if (id !== next.match.params.id) {
      this.load(next.match.params.id);
    }
  }

  load(id) {
    const {loaders} = this.props;

    const all_loaders = [this.loadEntity];

    if (isDefined(loaders)) {
      all_loaders.push(...this.props.loaders);
    }

    this.cancelLoading();

    const token = new CancelToken(cancel => this.cancel = cancel);

    const promises = all_loaders.map(loader_func =>
      loader_func.call(this, id, token));

    this.setState({loading: true});

    Promise.all(promises)
      .then(values => {
        this.cancel = undefined;
        return values.reduce((sum, cur) => sum || cur, false);
      })
      .then(refresh => this.startTimer(refresh))
      .catch(err => {
        log.error('Error while loading data', err);
        this.setState({loading: false});
      });
  }

  reload() {
    const {id} = this.props.match.params;
    this.load(id);
  }

  loadEntity(id, cancel_token) {
    log.debug('Loading entity', id);

    return this.entity_command.get({id}, {cancel_token}).then(response => {

      const {data: entity, meta} = response;

      log.debug('Loaded entity', entity);

      this.setState({entity, loading: false});

      if (meta.fromcache && meta.dirty) {
        log.debug('Forcing reload of entity', meta.dirty);
        return true;
      }
      return false;
    })
      .catch(err => {
        if (isDefined(err.isCancel) && err.isCancel()) {
          return;
        }
        this.handleError(err);
        return Promise.reject(err);
      });
  }

  handleChanged() {
    this.reload();
    this.props.renewSessionTimeout();
  }

  getRefreshInterval() {
    const {gmp} = this.props;
    return gmp.autorefresh * 1000;
  }

  cancelLastRequest() {
    if (isDefined(this.cancel)) {
      this.cancel();
    }
  }

  cancelLoading() {
    this.cancelLastRequest();
    this.clearTimer(); // remove possible running timer
  }

  startTimer(immediate = false) {
    const refresh = immediate ? 0 : this.getRefreshInterval();

    if (refresh >= 0) {
      this.timer = window.setTimeout(this.handleTimer, refresh);
      log.debug('Started reload timer with id', this.timer, 'and interval of',
        refresh, 'milliseconds');
    }
  }

  clearTimer() {
    if (isDefined(this.timer)) {
      log.debug('Clearing reload timer with id', this.timer);
      window.clearTimeout(this.timer);
    }
  }

  handleTimer() {
    log.debug('Timer', this.timer, 'finished. Reloading data.');

    this.timer = undefined;
    this.reload();
  }

  handleError(error) {
    const {showError} = this.props;
    log.error(error);
    showError(error);
  }

  render() {
    const {
      children,
      name,
      resourceType = name,
      onDownload,
    } = this.props;
    return (
      <TagsHandler
        name={name}
        resourceType={resourceType}
        onChanged={this.handleChanged}
        onError={this.handleError}
      >{({
        add,
        create,
        delete: delete_func,
        disable,
        edit,
        enable,
        remove,
      }) => children({
        resourceType,
        entityCommand: this.entity_command,
        onChanged: this.handleChanged,
        onSuccess: this.handleChanged,
        onError: this.handleError,
        onDownloaded: onDownload,
        onTagAddClick: add,
        onTagCreateClick: create,
        onTagDeleteClick: delete_func,
        onTagDisableClick: disable,
        onTagEditClick: edit,
        onTagEnableClick: enable,
        onTagRemoveClick: remove,
        ...this.state,
      })
        }
      </TagsHandler>
    );
  }
}

EntityContainer.propTypes = {
  children: PropTypes.func.isRequired,
  gmp: PropTypes.gmp.isRequired,
  loaders: PropTypes.array,
  match: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  renewSessionTimeout: PropTypes.func.isRequired,
  resourceType: PropTypes.string,
  showError: PropTypes.func.isRequired,
  showSuccessMessage: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default compose(
  withGmp,
  withDialogNotification,
  withDownload,
  withRouter,
  connect(undefined, (dispatch, {gmp}) => ({
    renewSessionTimeout: () => dispatch(renewSessionTimeout({gmp})),
  }))
)(EntityContainer);

// vim: set ts=2 sw=2 tw=80:
