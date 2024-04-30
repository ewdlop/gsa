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
import {describe, test, expect, testing} from '@gsa/testing';

import Filter from 'gmp/models/filter';

import {render, fireEvent} from 'web/utils/testing';

import {getRadioInputs} from 'web/components/testing';

import BooleanFilterGroup from '../booleanfiltergroup';

describe('BooleanFilterGroup tests', () => {
  test('should render', () => {
    const filter = Filter.fromString();
    const title = 'foo';
    const name = 'active';
    const handleChange = testing.fn();

    const {element} = render(
      <BooleanFilterGroup
        filter={filter}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    expect(element).toBeInTheDocument();
  });

  test('should call change handler', () => {
    const filter = Filter.fromString('active=0');
    const title = 'foo';
    const name = 'active';
    const handleChange = testing.fn();

    render(
      <BooleanFilterGroup
        filter={filter}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    const radio = getRadioInputs();
    fireEvent.click(radio[0]);

    expect(handleChange).toHaveBeenCalledWith(1, 'active');
  });

  test('should check radio', () => {
    const filter = Filter.fromString('apply_overrides=0');
    const title = 'foo';
    const name = 'apply_overrides';
    const handleChange = testing.fn();

    render(
      <BooleanFilterGroup
        filter={filter}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    const radio = getRadioInputs();

    expect(radio[1].checked).toEqual(true);
  });

  test('should uncheck radio of previous choice', () => {
    const title = 'foo';
    const name = 'apply_overrides';
    const filter1 = Filter.fromString('apply_overrides=1');
    const filter2 = Filter.fromString('apply_overrides=0');
    const handleChange = testing.fn();

    const {rerender} = render(
      <BooleanFilterGroup
        filter={filter1}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    const radio = getRadioInputs();

    expect(radio[0].checked).toEqual(true);
    expect(radio[1].checked).toEqual(false);

    rerender(
      <BooleanFilterGroup
        filter={filter2}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    expect(radio[0].checked).toEqual(false);
    expect(radio[1].checked).toEqual(true);
  });

  test('should use filter value by default', () => {
    const title = 'foo';
    const name = 'apply_overrides';
    const filter = Filter.fromString('apply_overrides=1');
    const handleChange = testing.fn();

    render(
      <BooleanFilterGroup
        filter={filter}
        name={name}
        title={title}
        onChange={handleChange}
      />,
    );

    const radio = getRadioInputs();
    expect(radio[0].checked).toEqual(true);
    expect(radio[1].checked).toEqual(false);
  });

  test('should render title', () => {
    const title = 'foo';
    const name = 'apply_overrides';
    const filter = Filter.fromString('apply_overrides=1');
    const handleChange = testing.fn();

    const {element} = render(
      <BooleanFilterGroup
        name={name}
        title={title}
        filter={filter}
        onChange={handleChange}
      />,
    );

    const titleElement = element.querySelector('.mantine-Text-root');

    expect(titleElement).toHaveTextContent('foo');
  });
});
