/* Copyright (C) 2020 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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
import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import BpmIcon from 'web/components/icon/bpmicon';
import ManualIcon from 'web/components/icon/manualicon';

import Layout from 'web/components/layout/layout';
import PageTitle from 'web/components/layout/pagetitle';
import ProcessMap from 'web/components/processmap/processmap';
import ProcessMapLoader from 'web/components/processmap/processmaploader';
import Section from 'web/components/section/section';

import Theme from 'web/utils/theme';
import withGmp from 'web/utils/withGmp';

const ToolBarIcons = () => (
  <span>
    <ManualIcon
      page="web-interface"
      anchor="displaying-the-feed-status"
      size="small"
      title={_('Help: Business Process Maps')}
    />
  </span>
);

const StyledLayout = styled(Layout)`
  align-items: stretch;
  height: 100%;
  overflow: hidden;
  border: 2px solid ${Theme.lightGray};
  border-radius: 2px;
`;

const PageWrapper = styled(Layout)`
  flex-direction: column;
  flex: 1;
  align-items: stretch;
  overflow: hidden;
  padding: 5px 10px 0px 10px;

  position: absolute;
  bottom: 15px;
  right: 0;
  left: 0;
  top: 77px; /* sum of TITLE_BAR_HEIGHT and MENU_BAR_HEIGHT */
`;

const ProcessMapsPage = () => {
  return (
    <React.Fragment>
      <PageTitle title={_('Business Process Map')} />
      <PageWrapper>
        <ToolBarIcons />
        <Section
          img={<BpmIcon size="large" />}
          title={_('Business Process Maph')}
        />
        <StyledLayout grow="1">
          <ProcessMapLoader>
            {({...loaderProps}) => <ProcessMap {...loaderProps} />}
          </ProcessMapLoader>
        </StyledLayout>
      </PageWrapper>
    </React.Fragment>
  );
};

export default withGmp(ProcessMapsPage);
