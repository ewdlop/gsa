/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';

import {NO_VALUE, YES_VALUE} from 'gmp/parser';

import {
  snmp_credential_filter,
  ssh_credential_filter,
  ESXI_CREDENTIAL_TYPES,
  SMB_CREDENTIAL_TYPES,
  SNMP_CREDENTIAL_TYPES,
  SSH_CREDENTIAL_TYPES,
  USERNAME_PASSWORD_CREDENTIAL_TYPE,
  SSH_ELEVATE_CREDENTIAL_TYPES,
} from 'gmp/models/credential';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';
import {renderSelectItems, UNSET_VALUE} from 'web/utils/render';

import SaveDialog from 'web/components/dialog/savedialog';

import FileField from 'web/components/form/filefield';
import FormGroup from 'web/components/form/formgroup';
import Radio from 'web/components/form/radio';
import Select from 'web/components/form/select';
import TextField from 'web/components/form/textfield';
import YesNoRadio from 'web/components/form/yesnoradio';

import InfoIcon from 'web/components/icon/infoicon';
import NewIcon from 'web/components/icon/newicon';

import Row from 'web/components/layout/row';

import useTranslation from 'web/hooks/useTranslation';

const DEFAULT_PORT = 22;

const DEFAULT_PORT_LIST_ID = 'c7e03b6c-3bbe-11e1-a057-406186ea4fc5';
const DEFAULT_PORT_LIST_NAME = 'OpenVAS Default';

const DEFAULT_PORT_LISTS = [
  {
    id: DEFAULT_PORT_LIST_ID,
    name: DEFAULT_PORT_LIST_NAME,
  },
];

const ALIVE_TESTS_DEFAULT = 'Scan Config Default';

const ALIVE_TESTS = [
  'ICMP Ping',
  'TCP-ACK Service Ping',
  'TCP-SYN Service Ping',
  'ARP Ping',
  'ICMP & TCP-ACK Service Ping',
  'ICMP & ARP Ping',
  'TCP-ACK Service & ARP Ping',
  'ICMP, TCP-ACK Service & ARP Ping',
  'Consider Alive',
];

const TargetDialog = ({
  alive_tests = ALIVE_TESTS_DEFAULT,
  allowSimultaneousIPs = YES_VALUE,
  capabilities,
  comment = '',
  credentials = [],
  esxi_credential_id = UNSET_VALUE,
  exclude_hosts = '',
  hosts = '',
  hosts_count,
  in_use = false,
  name,
  port = DEFAULT_PORT,
  port_list_id = DEFAULT_PORT_LIST_ID,
  port_lists = DEFAULT_PORT_LISTS,
  reverse_lookup_only = NO_VALUE,
  reverse_lookup_unify = NO_VALUE,
  smb_credential_id = UNSET_VALUE,
  snmp_credential_id = UNSET_VALUE,
  ssh_credential_id = UNSET_VALUE,
  ssh_elevate_credential_id = UNSET_VALUE,
  target_source = 'manual',
  target_exclude_source = 'manual',
  title,
  onClose,
  onNewCredentialsClick,
  onNewPortListClick,
  onSave,
  onPortListChange,
  onSshCredentialChange,
  onSmbCredentialChange,
  onEsxiCredentialChange,
  onSnmpCredentialChange,
  onSshElevateCredentialChange,
  ...initial
}) => {
  const [_] = useTranslation();

  name = name || _('Unnamed');
  title = title || _('New Target');

  const ALIVE_TESTS_ITEMS = [
    {
      value: ALIVE_TESTS_DEFAULT,
      label: _(ALIVE_TESTS_DEFAULT),
    },
    ...ALIVE_TESTS.map(value => ({value, label: value})),
  ];

  const NEW_SSH = {
    id_field: 'ssh_credential_id',
    types: SSH_CREDENTIAL_TYPES,
    title: _('Create new SSH credential'),
  };

  const NEW_SSH_ELEVATE = {
    id_field: 'ssh_elevate_credential_id',
    types: SSH_ELEVATE_CREDENTIAL_TYPES,
    title: _('Create new SSH elevate credential'),
  };

  const NEW_SMB = {
    id_field: 'smb_credential_id',
    title: _('Create new SMB credential'),
    types: SMB_CREDENTIAL_TYPES,
  };

  const NEW_ESXI = {
    id_field: 'esxi_credential_id',
    title: _('Create new ESXi credential'),
    types: ESXI_CREDENTIAL_TYPES,
  };

  const NEW_SNMP = {
    id_field: 'snmp_credential_id',
    title: _('Create new SNMP credential'),
    types: SNMP_CREDENTIAL_TYPES,
  };

  const ssh_credentials = credentials.filter(
    value =>
      ssh_credential_filter(value) && value.id !== ssh_elevate_credential_id,
  ); // filter out ssh_elevate_credential_id. If ssh_elevate_credential_id is UNSET_VALUE, this is ok. Because the Select will add back the UNSET_VALUE
  const up_credentials = credentials.filter(
    value => value.credential_type === USERNAME_PASSWORD_CREDENTIAL_TYPE,
  );
  const elevateUpCredentials = up_credentials.filter(
    value => value.id !== ssh_credential_id,
  );
  const snmp_credentials = credentials.filter(snmp_credential_filter);

  const uncontrolledValues = {
    ...initial,
    alive_tests,
    comment,
    name,
    port,
    exclude_hosts,
    hosts,
    hosts_count,
    in_use,
    reverse_lookup_only,
    reverse_lookup_unify,
    target_source,
    target_exclude_source,
    allowSimultaneousIPs,
  };

  const controlledValues = {
    port_list_id,
    esxi_credential_id,
    smb_credential_id,
    snmp_credential_id,
    ssh_credential_id,
    ssh_elevate_credential_id,
  };

  return (
    <SaveDialog
      title={title}
      defaultValues={uncontrolledValues}
      values={controlledValues}
      onClose={onClose}
      onSave={onSave}
    >
      {({values: state, onValueChange}) => {
        return (
          <>
            <FormGroup title={_('Name')}>
              <TextField
                name="name"
                grow="1"
                value={state.name}
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('Comment')}>
              <TextField
                name="comment"
                value={state.comment}
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('Hosts')}>
              <Row>
                <Radio
                  title={_('Manual')}
                  name="target_source"
                  disabled={in_use}
                  checked={state.target_source === 'manual'}
                  value="manual"
                  onChange={onValueChange}
                />
                <TextField
                  grow="1"
                  disabled={in_use || state.target_source !== 'manual'}
                  name="hosts"
                  value={state.hosts}
                  onChange={onValueChange}
                />
              </Row>
              <Row>
                <Radio
                  title={_('From file')}
                  name="target_source"
                  disabled={in_use}
                  checked={state.target_source === 'file'}
                  value="file"
                  onChange={onValueChange}
                />
                <FileField
                  grow="1"
                  name="file"
                  disabled={in_use || state.target_source !== 'file'}
                  onChange={onValueChange}
                />

                {state.hosts_count && (
                  <Radio
                    title={_('From host assets ({{count}} hosts)', {
                      count: state.hosts_count,
                    })}
                    name="target_source"
                    disabled={in_use}
                    checked={state.target_source === 'asset_hosts'}
                    value="asset_hosts"
                    onChange={onValueChange}
                  />
                )}
              </Row>
            </FormGroup>

            <FormGroup title={_('Exclude Hosts')}>
              <Row>
                <Radio
                  title={_('Manual')}
                  name="target_exclude_source"
                  disabled={in_use}
                  checked={state.target_exclude_source === 'manual'}
                  value="manual"
                  onChange={onValueChange}
                />
                <TextField
                  grow="1"
                  disabled={in_use || state.target_exclude_source !== 'manual'}
                  name="exclude_hosts"
                  value={state.exclude_hosts}
                  onChange={onValueChange}
                />
              </Row>
              <Row>
                <Radio
                  title={_('From file')}
                  name="target_exclude_source"
                  disabled={in_use}
                  checked={state.target_exclude_source === 'file'}
                  value="file"
                  onChange={onValueChange}
                />
                <FileField
                  grow="1"
                  name="exclude_file"
                  disabled={in_use || state.target_exclude_source !== 'file'}
                  onChange={onValueChange}
                />
              </Row>
            </FormGroup>

            <FormGroup
              title={_('Allow simultaneous scanning via multiple IPs')}
            >
              <YesNoRadio
                name="allowSimultaneousIPs"
                value={state.allowSimultaneousIPs}
                onChange={onValueChange}
              />
            </FormGroup>

            {capabilities.mayOp('get_port_lists') && (
              <FormGroup title={_('Port List')} direction="row">
                <Select
                  grow="1"
                  name="port_list_id"
                  disabled={in_use}
                  items={renderSelectItems(port_lists)}
                  value={state.port_list_id}
                  onChange={onPortListChange}
                />
                {!in_use && (
                  <NewIcon
                    title={_('Create a new port list')}
                    onClick={onNewPortListClick}
                  />
                )}
              </FormGroup>
            )}

            <FormGroup title={_('Alive Test')}>
              <Select
                name="alive_tests"
                items={ALIVE_TESTS_ITEMS}
                value={state.alive_tests}
                onChange={onValueChange}
              />
            </FormGroup>

            {capabilities.mayOp('get_credentials') && (
              <h4>{_('Credentials for authenticated checks')}</h4>
            )}

            {capabilities.mayOp('get_credentials') && (
              <FormGroup title={_('SSH')}>
                <Row>
                  <Select
                    grow="1"
                    name="ssh_credential_id"
                    disabled={in_use}
                    items={renderSelectItems(ssh_credentials, UNSET_VALUE)}
                    value={state.ssh_credential_id}
                    onChange={onSshCredentialChange}
                  />
                  {_('on port')}
                  <TextField
                    name="port"
                    disabled={in_use}
                    value={state.port}
                    onChange={onValueChange}
                  />
                  {!in_use && (
                    <NewIcon
                      title={_('Create a new credential')}
                      value={NEW_SSH}
                      onClick={onNewCredentialsClick}
                    />
                  )}
                </Row>
                {state.ssh_credential_id !== UNSET_VALUE && (
                  <Row>
                    <InfoIcon
                      title={_(
                        'This feature is experimental and may ' +
                          'not work reliable under all circumstances.',
                      )}
                    />
                    <span>{_('Elevate privileges')}</span>
                    <Select
                      grow="1"
                      name="ssh_elevate_credential_id"
                      disabled={in_use}
                      items={renderSelectItems(
                        elevateUpCredentials,
                        UNSET_VALUE,
                      )}
                      value={state.ssh_elevate_credential_id}
                      onChange={onSshElevateCredentialChange}
                    />
                    {!in_use && (
                      <NewIcon
                        title={_('Create a new credential')}
                        value={NEW_SSH_ELEVATE}
                        onClick={onNewCredentialsClick}
                      />
                    )}
                  </Row>
                )}
              </FormGroup>
            )}

            {capabilities.mayOp('get_credentials') && (
              <FormGroup title={_('SMB')} direction="row">
                <Select
                  grow="1"
                  name="smb_credential_id"
                  disabled={in_use}
                  items={renderSelectItems(up_credentials, UNSET_VALUE)}
                  value={state.smb_credential_id}
                  onChange={onSmbCredentialChange}
                />
                {!in_use && (
                  <NewIcon
                    title={_('Create a new credential')}
                    value={NEW_SMB}
                    onClick={onNewCredentialsClick}
                  />
                )}
              </FormGroup>
            )}

            {capabilities.mayOp('get_credentials') && (
              <FormGroup title={_('ESXi')} direction="row">
                <Select
                  grow="1"
                  disabled={in_use}
                  name="esxi_credential_id"
                  items={renderSelectItems(up_credentials, UNSET_VALUE)}
                  value={state.esxi_credential_id}
                  onChange={onEsxiCredentialChange}
                />
                {!in_use && (
                  <NewIcon
                    title={_('Create a new credential')}
                    value={NEW_ESXI}
                    onClick={onNewCredentialsClick}
                  />
                )}
              </FormGroup>
            )}

            {capabilities.mayOp('get_credentials') && (
              <FormGroup title={_('SNMP')} direction="row">
                <Select
                  grow="1"
                  disabled={in_use}
                  name="snmp_credential_id"
                  items={renderSelectItems(snmp_credentials, UNSET_VALUE)}
                  value={state.snmp_credential_id}
                  onChange={onSnmpCredentialChange}
                />
                {!in_use && (
                  <NewIcon
                    title={_('Create a new credential')}
                    value={NEW_SNMP}
                    onClick={onNewCredentialsClick}
                  />
                )}
              </FormGroup>
            )}

            <FormGroup title={_('Reverse Lookup Only')}>
              <YesNoRadio
                name="reverse_lookup_only"
                disabled={in_use}
                value={state.reverse_lookup_only}
                onChange={onValueChange}
              />
            </FormGroup>

            <FormGroup title={_('Reverse Lookup Unify')}>
              <YesNoRadio
                name="reverse_lookup_unify"
                disabled={in_use}
                value={state.reverse_lookup_unify}
                onChange={onValueChange}
              />
            </FormGroup>
          </>
        );
      }}
    </SaveDialog>
  );
};

TargetDialog.propTypes = {
  alive_tests: PropTypes.oneOf([ALIVE_TESTS_DEFAULT, ...ALIVE_TESTS]),
  allowSimultaneousIPs: PropTypes.yesno,
  capabilities: PropTypes.capabilities.isRequired,
  comment: PropTypes.string,
  credentials: PropTypes.array,
  esxi_credential_id: PropTypes.idOrZero,
  exclude_hosts: PropTypes.string,
  hosts: PropTypes.string,
  hosts_count: PropTypes.number,
  in_use: PropTypes.bool,
  name: PropTypes.string,
  port: PropTypes.numberOrNumberString,
  port_list_id: PropTypes.idOrZero,
  port_lists: PropTypes.array,
  reverse_lookup_only: PropTypes.yesno,
  reverse_lookup_unify: PropTypes.yesno,
  smb_credential_id: PropTypes.idOrZero,
  snmp_credential_id: PropTypes.idOrZero,
  ssh_credential_id: PropTypes.idOrZero,
  ssh_elevate_credential_id: PropTypes.idOrZero,
  target_exclude_source: PropTypes.oneOf(['manual', 'file']),
  target_source: PropTypes.oneOf(['manual', 'file', 'asset_hosts']),
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onEsxiCredentialChange: PropTypes.func.isRequired,
  onNewCredentialsClick: PropTypes.func.isRequired,
  onNewPortListClick: PropTypes.func.isRequired,
  onPortListChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSmbCredentialChange: PropTypes.func.isRequired,
  onSnmpCredentialChange: PropTypes.func.isRequired,
  onSshCredentialChange: PropTypes.func.isRequired,
  onSshElevateCredentialChange: PropTypes.func.isRequired,
};

export default withCapabilities(TargetDialog);

// vim: set ts=2 sw=2 tw=80:
