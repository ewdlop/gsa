/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';
import CreateNamedFilterGroup from 'web/components/powerfilter/createnamedfiltergroup';
import FilterDialog from 'web/components/powerfilter/filterdialog';
import FilterStringGroup from 'web/components/powerfilter/filterstringgroup';
import FirstResultGroup from 'web/components/powerfilter/firstresultgroup';
import ResultsPerPageGroup from 'web/components/powerfilter/resultsperpagegroup';
import SeverityValuesGroup from 'web/components/powerfilter/severityvaluesgroup';
import SolutionTypeGroup from 'web/components/powerfilter/solutiontypegroup';
import SortByGroup from 'web/components/powerfilter/sortbygroup';
import TicketStatusFilterGroup from 'web/components/powerfilter/ticketstatusgroup';
import useFilterDialog from 'web/components/powerfilter/useFilterDialog';
import useFilterDialogSave from 'web/components/powerfilter/useFilterDialogSave';
import useCapabilities from 'web/hooks/useCapabilities';
import useTranslation from 'web/hooks/useTranslation';
import PropTypes from 'web/utils/proptypes';

const TicketsFilterDialogComponent = ({
  filter: initialFilter,
  onCloseClick,
  onClose = onCloseClick,
  onFilterChanged,
  onFilterCreated,
}) => {
  const capabilities = useCapabilities();
  const [_] = useTranslation();
  const filterDialogProps = useFilterDialog(initialFilter);
  const [handleSave] = useFilterDialogSave(
    'ticket',
    {
      onClose,
      onFilterChanged,
      onFilterCreated,
    },
    filterDialogProps,
  );
  const SORT_FIELDS = [
    {
      name: 'name',
      displayName: _('Vulnerability'),
    },
    {
      name: 'severity',
      displayName: _('Severity'),
    },
    {
      name: 'host',
      displayName: _('Host'),
    },
    {
      name: 'solution_type',
      displayName: _('Solution Type'),
    },
    {
      name: 'username',
      displayName: _('Assigned User'),
    },
    {
      name: 'modified',
      displayName: _('Modification Time'),
    },
    {
      name: 'status',
      displayName: _('Status'),
    },
  ];

  const {
    filter,
    filterString,
    filterName,
    saveNamedFilter,
    onFilterStringChange,
    onFilterValueChange,
    onFilterChange,
    onSortByChange,
    onSortOrderChange,
    onValueChange,
  } = filterDialogProps;
  return (
    <FilterDialog onClose={onClose} onSave={handleSave}>
      <FilterStringGroup
        filter={filterString}
        name="filterstring"
        onChange={onFilterStringChange}
      />

      <SolutionTypeGroup filter={filter} onChange={onFilterChange} />

      <SeverityValuesGroup
        filter={filter}
        name="severity"
        title={_('Severity')}
        onChange={onFilterValueChange}
      />

      <TicketStatusFilterGroup filter={filter} onChange={onFilterValueChange} />

      <FirstResultGroup filter={filter} onChange={onFilterValueChange} />

      <ResultsPerPageGroup filter={filter} onChange={onFilterValueChange} />

      <SortByGroup
        fields={SORT_FIELDS}
        filter={filter}
        onSortByChange={onSortByChange}
        onSortOrderChange={onSortOrderChange}
      />

      {capabilities.mayCreate('filter') && (
        <CreateNamedFilterGroup
          filter={filter}
          filterName={filterName}
          saveNamedFilter={saveNamedFilter}
          onValueChange={onValueChange}
        />
      )}
    </FilterDialog>
  );
};

TicketsFilterDialogComponent.propTypes = {
  filter: PropTypes.filter,
  onClose: PropTypes.func,
  onCloseClick: PropTypes.func, // should be removed in future
  onFilterChanged: PropTypes.func,
  onFilterCreated: PropTypes.func,
};

export default TicketsFilterDialogComponent;
