/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import React from 'react';
import PropTypes from 'web/utils/proptypes';
import {
  makeCompareNumber,
  makeCompareSeverity,
  makeCompareString,
} from 'web/utils/sort';

import ApplicationsTable from './applicationstable';
import ReportEntitiesContainer from './reportentitiescontainer';



const appsSortFunctions = {
  name: makeCompareString('name'),
  hosts: makeCompareNumber(entity => entity.hosts.count),
  occurrences: makeCompareNumber(entity => entity.occurrences.total),
  severity: makeCompareSeverity(),
};

const ApplicationsTab = ({
  counts,
  applications,
  filter,
  isUpdating,
  sortField,
  sortReverse,
  onInteraction,
  onSortChange,
}) => (
  <ReportEntitiesContainer
    counts={counts}
    entities={applications}
    filter={filter}
    sortField={sortField}
    sortFunctions={appsSortFunctions}
    sortReverse={sortReverse}
    onInteraction={onInteraction}
  >
    {({
      entities,
      entitiesCounts,
      sortBy,
      sortDir,
      onFirstClick,
      onLastClick,
      onNextClick,
      onPreviousClick,
    }) => (
      <ApplicationsTable
        entities={entities}
        entitiesCounts={entitiesCounts}
        filter={filter}
        isUpdating={isUpdating}
        sortBy={sortBy}
        sortDir={sortDir}
        toggleDetailsIcon={false}
        onFirstClick={onFirstClick}
        onLastClick={onLastClick}
        onNextClick={onNextClick}
        onPreviousClick={onPreviousClick}
        onSortChange={onSortChange}
      />
    )}
  </ReportEntitiesContainer>
);

ApplicationsTab.propTypes = {
  applications: PropTypes.array,
  counts: PropTypes.object,
  filter: PropTypes.filter.isRequired,
  isUpdating: PropTypes.bool,
  sortField: PropTypes.string.isRequired,
  sortReverse: PropTypes.bool.isRequired,
  onInteraction: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default ApplicationsTab;
