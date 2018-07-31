/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
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

import {isDefined} from '../utils/identity';

import Model from '../model.js';

class Asset extends Model {

  static asset_type = 'unknown';
  static entity_type = 'asset';

  constructor(elem, asset_type) {
    super(elem);

    if (!isDefined(this.asset_type)) { // only overwrite if not already set
      this.asset_type = isDefined(asset_type) ? asset_type :
        this.constructor.asset_type;
    }
  }
}

export default Asset;

// vim: set ts=2 sw=2 tw=80: