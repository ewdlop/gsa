/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {combineReducers} from 'web/store/utils';

import {
  USER_SETTINGS_DEFAULTS_LOADING_ERROR,
  USER_SETTINGS_DEFAULTS_LOADING_REQUEST,
  USER_SETTINGS_DEFAULTS_LOADING_SUCCESS,
} from './actions';

const isLoading = (state = false, action) => {
  switch (action.type) {
    case USER_SETTINGS_DEFAULTS_LOADING_REQUEST:
      return true;
    case USER_SETTINGS_DEFAULTS_LOADING_ERROR:
    case USER_SETTINGS_DEFAULTS_LOADING_SUCCESS:
      return false;
    default:
      return state;
  }
};

const error = (state, action) => {
  switch (action.type) {
    case USER_SETTINGS_DEFAULTS_LOADING_ERROR:
      return action.error;
    case USER_SETTINGS_DEFAULTS_LOADING_SUCCESS:
      return undefined;
    default:
      return state;
  }
};

const byName = (state = {}, action) => {
  switch (action.type) {
    case USER_SETTINGS_DEFAULTS_LOADING_SUCCESS: {
      const {data} = action;
      return {...state, ...data};
    }
    default:
      return state;
  }
};

const defaults = combineReducers({
  isLoading,
  error,
  byName,
});

export default defaults;

// vim: set ts=2 sw=2 tw=80:
