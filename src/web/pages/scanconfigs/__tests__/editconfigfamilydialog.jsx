/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';
import Nvt from 'gmp/models/nvt';
import {
  clickElement,
  getDialog,
  getDialogSaveButton,
  getTableBody,
  getTableHeader,
} from 'web/components/testing';
import {rendererWith, fireEvent} from 'web/utils/testing';

import EditConfigFamilyDialog from '../editconfigfamilydialog';

const nvt = Nvt.fromElement({
  _oid: '1234',
  name: 'nvt',
  family: 'family',
  cvss_base: 1,
  preference_count: 3,
});

const nvt2 = Nvt.fromElement({
  _oid: '5678',
  name: 'nvt2',
  family: 'family',
  cvss_base: 10,
  timeout: 1,
  preference_count: 4,
});

const nvt3 = Nvt.fromElement({
  _oid: '2345',
  name: 'nvt3',
  family: 'family',
  timeout: 2,
  preference_count: 2,
});

const selected = {
  1234: 0,
  5678: 0,
};

describe('EditConfigFamilyDialog component tests', () => {
  test('should render dialog', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {baseElement} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    expect(baseElement).toBeVisible();

    expect(baseElement).toHaveTextContent('Config');
    expect(baseElement).toHaveTextContent('foo');
  });

  test('should render loading indicator', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {baseElement, getByTestId} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={true}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    expect(baseElement).toBeVisible();

    expect(getByTestId('loading')).toBeInTheDocument();

    expect(baseElement).not.toHaveTextContent('Config');
    expect(baseElement).not.toHaveTextContent('foo');
  });

  test('should save data', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    const saveButton = getDialogSaveButton();
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith({
      configId: 'c1',
      familyName: 'family',
      selected: selected,
    });
  });

  test('should allow to close the dialog', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {getByTestId} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    const closeButton = getByTestId('dialog-close-button');

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
    expect(handleSave).not.toHaveBeenCalled();
  });

  test('should allow to change data', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {baseElement, getByTestId} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    const inputs = baseElement.querySelectorAll('input');
    fireEvent.click(inputs[0]);

    const saveButton = getByTestId('dialog-save-button');
    fireEvent.click(saveButton);

    const newSelected = {
      1234: 1,
      5678: 0,
    };

    expect(handleSave).toHaveBeenCalledWith({
      configId: 'c1',
      familyName: 'family',
      selected: newSelected,
    });
  });

  test('should call click handler', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {getAllByTestId} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    const editButtons = getAllByTestId('svg-icon');
    fireEvent.click(editButtons[0]);

    expect(handleOpenEditNvtDetailsDialog).toHaveBeenCalledWith(nvt.id);
  });

  test('should sort table', async () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const newSelected = {
      1234: 0,
      5678: 1,
      2345: 0,
    };

    const {render} = rendererWith({capabilities: true});
    render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2, nvt3]}
        selected={newSelected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );
    const getOidColumn = row => row.querySelectorAll('td')[1];

    const dialog = getDialog();
    const tableHeader = getTableHeader(dialog);
    const tableBody = getTableBody(dialog);
    let rows = tableBody.querySelectorAll('tr');
    const columns = tableHeader.querySelectorAll('a');

    expect(getOidColumn(rows[0])).toHaveTextContent('1234');
    expect(getOidColumn(rows[1])).toHaveTextContent('5678');
    expect(getOidColumn(rows[2])).toHaveTextContent('2345');

    // sort by name column desc
    expect(columns[0]).toHaveTextContent('Name');
    await clickElement(columns[0]);

    rows = tableBody.querySelectorAll('tr');

    expect(getOidColumn(rows[0])).toHaveTextContent('2345');
    expect(getOidColumn(rows[1])).toHaveTextContent('5678');
    expect(getOidColumn(rows[2])).toHaveTextContent('1234');

    // sort by oid column
    expect(columns[1]).toHaveTextContent('OID');
    await clickElement(columns[1]);

    rows = tableBody.querySelectorAll('tr');

    expect(getOidColumn(rows[0])).toHaveTextContent('1234');
    expect(getOidColumn(rows[1])).toHaveTextContent('2345');
    expect(getOidColumn(rows[2])).toHaveTextContent('5678');

    // sort by severity column
    expect(columns[2]).toHaveTextContent('Severity');
    await clickElement(columns[2]);

    rows = tableBody.querySelectorAll('tr');

    expect(getOidColumn(rows[0])).toHaveTextContent('2345');
    expect(getOidColumn(rows[1])).toHaveTextContent('1234');
    expect(getOidColumn(rows[2])).toHaveTextContent('5678');

    // sort by timeout column
    expect(columns[3]).toHaveTextContent('Timeout');
    await clickElement(columns[3]);

    rows = tableBody.querySelectorAll('tr');

    expect(getOidColumn(rows[0])).toHaveTextContent('1234');
    expect(getOidColumn(rows[1])).toHaveTextContent('5678');
    expect(getOidColumn(rows[2])).toHaveTextContent('2345');

    // sort by selected column
    expect(columns[4]).toHaveTextContent('Selected');
    fireEvent.click(columns[4]);

    rows = tableBody.querySelectorAll('tr');

    expect(getOidColumn(rows[0])).toHaveTextContent('5678');
    expect(getOidColumn(rows[1])).toHaveTextContent('1234');
    expect(getOidColumn(rows[2])).toHaveTextContent('2345');
  });

  test('should allow selecting an NVT', () => {
    const handleClose = testing.fn();
    const handleSave = testing.fn();
    const handleOpenEditNvtDetailsDialog = testing.fn();

    const {render} = rendererWith({capabilities: true});
    const {getAllByRole} = render(
      <EditConfigFamilyDialog
        configId="c1"
        configName="foo"
        configNameLabel="Config"
        familyName="family"
        isLoadingFamily={false}
        nvts={[nvt, nvt2]}
        selected={selected}
        title="Foo title"
        onClose={handleClose}
        onEditNvtDetailsClick={handleOpenEditNvtDetailsDialog}
        onSave={handleSave}
      />,
    );

    const checkboxes = getAllByRole('checkbox');

    expect(checkboxes[0].checked).toBe(false);

    fireEvent.click(checkboxes[0]);

    expect(checkboxes[0].checked).toBe(true);
  });
});
