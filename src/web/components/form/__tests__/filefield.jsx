/* Copyright (C) 2018-2022 Greenbone AG
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

import {render, fireEvent} from 'web/utils/testing';

import FileField from '../filefield';

describe('FileField tests', () => {
  test('should render', () => {
    const {element} = render(<FileField />);

    expect(element).toBeInTheDocument();
  });

  test('should call change handler with file', () => {
    const onChange = testing.fn();

    const {element} = render(<FileField onChange={onChange} />);

    const input = element.querySelector('input[type=file]');

    fireEvent.change(input, {target: {files: ['bar']}});

    expect(onChange).toHaveBeenCalledWith('bar', undefined);
  });

  test('should call change handler with file and name', () => {
    const onChange = testing.fn();

    const {element} = render(<FileField name="foo" onChange={onChange} />);

    const input = element.querySelector('input[type=file]');

    fireEvent.change(input, {target: {files: ['bar']}});

    expect(onChange).toHaveBeenCalledWith('bar', 'foo');
  });

  test('should not call change handler if disabled', () => {
    const onChange = testing.fn();

    const {element} = render(<FileField disabled={true} onChange={onChange} />);

    const input = element.querySelector('input[type=file]');

    fireEvent.change(input, {target: {files: ['bar']}});

    expect(onChange).not.toHaveBeenCalled();
  });
});
