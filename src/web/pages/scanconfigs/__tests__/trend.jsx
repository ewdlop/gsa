/* Copyright (C) 2019-2022 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/* eslint-disable no-console */
import {describe, test, expect} from '@gsa/testing';

import {
  SCANCONFIG_TREND_DYNAMIC,
  SCANCONFIG_TREND_STATIC,
} from 'gmp/models/scanconfig';

import {render} from 'web/utils/testing';

import Trend from '../trend';

describe('Scan Config Trend tests', () => {
  test('should render', () => {
    const {element} = render(
      <Trend
        titleDynamic="Dynamic"
        titleStatic="Static"
        trend={SCANCONFIG_TREND_DYNAMIC}
      />,
    );

    expect(element).toBeInTheDocument();
  });

  test('should render static title', () => {
    const {getByTestId} = render(
      <Trend
        titleDynamic="Dynamic"
        titleStatic="Static"
        trend={SCANCONFIG_TREND_STATIC}
      />,
    );

    const trendIcon = getByTestId('svg-icon');

    expect(trendIcon).toHaveAttribute('title', 'Static');
  });

  test('should render dynamic title', () => {
    const {getByTestId} = render(
      <Trend
        titleDynamic="Dynamic"
        titleStatic="Static"
        trend={SCANCONFIG_TREND_DYNAMIC}
      />,
    );

    const trendIcon = getByTestId('svg-icon');

    expect(trendIcon).toHaveAttribute('title', 'Dynamic');
  });

  test('should render N/A', () => {
    // deactivate console.error for this test
    // to be able to test trend=-1
    const consoleError = console.error;
    console.error = () => {};

    const {element} = render(
      <Trend titleDynamic="Dynamic" titleStatic="Static" trend={-1} />,
    );

    expect(element).toHaveTextContent('N/A');

    console.warn = consoleError;
  });
});
