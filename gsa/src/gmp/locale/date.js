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
import logger from '../log';

import {isDefined, isString, isJsDate} from '../utils/identity';

import {parseDate} from '../parser';

import {setLocale as setMomentLocale, isDate} from '../models/date';

const log = logger.getLogger('gmp.locale.date');

export const setLocale = lang => {
  log.debug('Setting date locale to', lang);
  setMomentLocale(lang);
};

export const getLocale = () => setMomentLocale();

const dateFormat = (date, format) => {
  if (!isDefined(date)) {
    return undefined;
  }

  if (!isDate(date)) {
    if (isString(date) || isJsDate(date)) {
      date = parseDate(date);
    }
    else {
      return undefined;
    }
  }
  return date.format(format);
};

export const shortDate = date => dateFormat(date, 'L');

export const longDate = date => dateFormat(date, 'llll');

export const dateTimeWithTimeZone = date => dateFormat(date, 'llll z');

// vim: set ts=2 sw=2 tw=80:
