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

import {render, fireEvent} from 'web/utils/testing';

import {getDialog, getSelectElement} from 'web/components/testing';

import Dialog from '../tagsdialog';

describe('TagsDialog dialog component tests', () => {
  test('should render dialog', () => {
    const handleClose = testing.fn();
    const handleNewTagClick = testing.fn();
    const handleSave = testing.fn();
    const handleTagChange = testing.fn();

    render(
      <Dialog
        entitiesCount={3}
        tags={[{name: 'foo', id: '123'}]}
        onClose={handleClose}
        onNewTagClick={handleNewTagClick}
        onSave={handleSave}
        onTagChanged={handleTagChange}
      />,
    );

    expect(getDialog()).toBeInTheDocument();
  });

  test('should disable tag selection when no options available', () => {
    const handleClose = testing.fn();
    const handleNewTagClick = testing.fn();
    const handleSave = testing.fn();
    const handleTagChange = testing.fn();

    render(
      <Dialog
        entitiesCount={3}
        onClose={handleClose}
        onNewTagClick={handleNewTagClick}
        onSave={handleSave}
        onTagChanged={handleTagChange}
      />,
    );

    expect(getSelectElement()).toBeDisabled();
  });

  test('should save data', () => {
    const handleClose = testing.fn();
    const handleNewTagClick = testing.fn();
    const handleSave = testing.fn();
    const handleTagChange = testing.fn();

    const {getByTestId} = render(
      <Dialog
        comment="foo"
        entitiesCount={3}
        name="bar"
        tagId="123"
        tags={[{name: 'foo', id: '123'}]}
        value="lorem"
        onClose={handleClose}
        onNewTagClick={handleNewTagClick}
        onSave={handleSave}
        onTagChanged={handleTagChange}
      />,
    );

    const saveButton = getByTestId('dialog-save-button');
    fireEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledWith({
      comment: 'foo',
      id: '123',
      name: 'bar',
      value: 'lorem',
    });
  });

  test('should allow to close the dialog', () => {
    const handleClose = testing.fn();
    const handleNewTagClick = testing.fn();
    const handleSave = testing.fn();
    const handleTagChange = testing.fn();

    const {getByTestId} = render(
      <Dialog
        entitiesCount={3}
        tags={[{name: 'foo', id: '123'}]}
        onClose={handleClose}
        onNewTagClick={handleNewTagClick}
        onSave={handleSave}
        onTagChanged={handleTagChange}
      />,
    );

    const closeButton = getByTestId('dialog-close-button');

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
