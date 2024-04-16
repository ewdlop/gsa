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

import PropTypes from 'web/utils/proptypes';

import DefaultFilterDialog from 'web/components/powerfilter/dialog';
import FilterDialog from 'web/components/powerfilter/filterdialog';
import useFilterDialog from 'web/components/powerfilter/useFilterDialog';
import useFilterDialogSave from 'web/components/powerfilter/useFilterDialogSave';

import useTranslation from 'web/hooks/useTranslation';

const TlsCertificatesFilterDialog = ({
  filter,
  onCloseClick,
  onClose = onCloseClick,
  onFilterChanged,
  onFilterCreated,
  ...props
}) => {
  const [_] = useTranslation();
  const filterDialogProps = useFilterDialog(filter);
  const [handleSave] = useFilterDialogSave(
    'tlscertificate',
    {
      onClose,
      onFilterChanged,
      onFilterCreated,
    },
    filterDialogProps,
  );
  const SORT_FIELDS = [
    {
      name: 'subject_dn',
      displayName: _('Subject DN'),
    },
    {
      name: 'issuer_dn',
      displayName: _('Issuer DN'),
    },
    {
      name: 'serial',
      displayName: _('Serial'),
    },
    {
      name: 'activates',
      displayName: _('Activates'),
    },
    {
      name: 'expires',
      displayName: _('Expires'),
    },
    {
      name: 'lastSeen',
      displayName: _('Last Seen'),
    },
  ];

  return (
    <FilterDialog onClose={onClose} onSave={handleSave}>
      <DefaultFilterDialog
        {...props}
        {...filterDialogProps}
        sortFields={SORT_FIELDS}
      />
    </FilterDialog>
  );
};

TlsCertificatesFilterDialog.propTypes = {
  filter: PropTypes.filter,
  onClose: PropTypes.func,
  onCloseClick: PropTypes.func, // should be removed in future
  onFilterChanged: PropTypes.func,
  onFilterCreated: PropTypes.func,
};

export default TlsCertificatesFilterDialog;
