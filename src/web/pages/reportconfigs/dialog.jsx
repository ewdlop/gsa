/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {parseBoolean} from 'gmp/parser';
import {map} from 'gmp/utils/array';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import SaveDialog from 'web/components/dialog/savedialog';
import Checkbox from 'web/components/form/checkbox';
import FormGroup from 'web/components/form/formgroup';
import MultiSelect from 'web/components/form/multiselect';
import Select from 'web/components/form/select';
import Spinner from 'web/components/form/spinner';
import TextArea from 'web/components/form/textarea';
import TextField from 'web/components/form/textfield';
import YesNoRadio from 'web/components/form/yesnoradio';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';
import Table from 'web/components/table/table';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

const Param = ({
  data,
  usingDefaultData,
  value,
  onPrefChange,
  onParamUsingDefaultChange,
  formats,
}) => {
  const {name, type, min, max} = value;
  const fieldValue = data[name];

  const formatOptions = map(formats, format => ({
    label: format.name,
    value: format.id,
  }));

  let field;
  if (type === 'boolean') {
    field = (
      <YesNoRadio
        convert={parseBoolean}
        name={name}
        noValue={false}
        value={fieldValue}
        yesValue={true}
        onChange={onPrefChange}
      />
    );
  } else if (type === 'integer') {
    field = (
      <Spinner
        max={max}
        min={min}
        name={name}
        type="int"
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  } else if (type === 'multi_selection') {
    const typeOptions = map(value.options, opt => ({
      label: opt.name,
      value: opt.value,
    }));
    field = (
      <MultiSelect
        items={typeOptions}
        name={name}
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  } else if (type === 'string') {
    field = (
      <TextField
        maxLength={max}
        name={name}
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  } else if (type === 'selection') {
    const typeOptions = map(value.options, opt => ({
      label: opt.name,
      value: opt.value,
    }));

    field = (
      <Select
        items={typeOptions}
        name={name}
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  } else if (type === 'report_format_list') {
    field = (
      <MultiSelect
        items={formatOptions}
        name={name}
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  } else {
    field = (
      <TextArea
        minRows="5"
        name={name}
        value={fieldValue}
        onChange={onPrefChange}
      />
    );
  }

  const useDefaultCheck = (
    <Checkbox
      checked={usingDefaultData[name]}
      name={name}
      onChange={onParamUsingDefaultChange}
    />
  );

  return (
    <TableRow>
      <TableData>{name}</TableData>
      <TableData>{field}</TableData>
      <TableData>{useDefaultCheck}</TableData>
    </TableRow>
  );
};

Param.propTypes = {
  data: PropTypes.object.isRequired,
  formats: PropTypes.array.isRequired,
  isEdit: PropTypes.bool,
  usingDefaultData: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  onParamUsingDefaultChange: PropTypes.func.isRequired,
  onPrefChange: PropTypes.func.isRequired,
};

class Dialog extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleReportFormatChange = this.handleReportFormatChange.bind(this);
    this.handleParamUsingDefaultChange =
      this.handleParamUsingDefaultChange.bind(this);
    this.handlePrefChange = this.handlePrefChange.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {originalParamInfo: []};
  }

  handleReportFormatChange(value, name) {
    const {onValueChange, gmp} = this.props;

    gmp.reportformat.get({id: value}).then(response => {
      const originalParamInfo = response.data.params;
      const params = {};
      const params_using_default = {};

      originalParamInfo.forEach(param => {
        params[param.name] = param.value;
        params_using_default[param.name] = true;
      });

      this.setState({
        originalParamInfo,
        params,
        params_using_default,
        report_format_id: value,
      });
    });

    if (onValueChange) {
      onValueChange(value, name);
    }
  }

  handlePrefChange(value, name) {
    const {onValueChange} = this.props;
    const {params, params_using_default} = this.state;

    params[name] = value;
    params_using_default[name] = false;
    this.setState({params, params_using_default});

    if (onValueChange) {
      onValueChange(params, 'params');
    }
  }

  handleParamUsingDefaultChange(value, name) {
    const {onValueChange} = this.props;
    const {params_using_default} = this.state;

    params_using_default[name] = value;
    this.setState({params_using_default});

    if (onValueChange) {
      onValueChange(params_using_default, 'params_using_default');
    }
  }

  handleSave(data) {
    const {onSave} = this.props;
    if (isDefined(onSave)) {
      const {
        params,
        params_using_default,
        report_format_id,
        originalParamInfo,
      } = this.state;
      const param_types = {};
      originalParamInfo.forEach(param_item => {
        param_types[param_item.name] = param_item.type;
      });
      onSave({
        ...data,
        params,
        params_using_default,
        param_types,
        report_format_id,
      });
    }
  }

  componentDidMount() {
    const {reportconfig} = this.props;
    if (isDefined(reportconfig)) {
      const originalParamInfo = reportconfig.params;
      const params = {};
      const params_using_default = {};

      originalParamInfo.forEach(param => {
        params[param.name] = param.value;
        params_using_default[param.name] = false;
        if (isDefined(param.value_using_default)) {
          params_using_default[param.name] = param.value_using_default;
        }
      });

      this.setState({
        originalParamInfo,
        params,
        params_using_default,
      });
    }
  }

  render() {
    const {
      formats,
      reportconfig,
      title = _('New Report Config'),
      onClose,
    } = this.props;

    const is_edit = isDefined(reportconfig);

    const configurable_formats = isDefined(formats)
      ? formats.filter(format => format.configurable)
      : [];

    const format_items = configurable_formats.map(format => ({
      label: format.name,
      value: format.id,
    }));

    const default_values = {
      name: _('Unnamed'),
      comment: '',
    };

    const report_config_values = isDefined(reportconfig)
      ? {
          ...reportconfig,
          report_format: reportconfig.report_format.id,
          comment: isDefined(reportconfig.comment) ? reportconfig.comment : '',
        }
      : undefined;

    const {originalParamInfo, params, params_using_default} = this.state;

    return (
      <SaveDialog
        defaultValues={
          isDefined(report_config_values)
            ? report_config_values
            : default_values
        }
        title={title}
        onClose={onClose}
        onSave={this.handleSave}
      >
        {({values: state, onValueChange}) => {
          return (
            <>
              <FormGroup title={_('Name')}>
                <TextField
                  name="name"
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

              <FormGroup title={_('Report Format')}>
                {isDefined(format_items) && format_items.length > 0 ? (
                  <Select
                    disabled={is_edit}
                    grow="1"
                    items={format_items}
                    name="report_format"
                    value={state.report_format}
                    onChange={this.handleReportFormatChange}
                  />
                ) : (
                  <span>{_('No configurable report formats found.')}</span>
                )}
              </FormGroup>

              {isDefined(originalParamInfo) && originalParamInfo.length > 0 && (
                <>
                  <h2>{_('Parameters')}</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead width="25%">{_('Name')}</TableHead>
                        <TableHead width="70%">{_('Value')}</TableHead>
                        <TableHead width="10%">{_('Default')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {originalParamInfo.map(param => (
                        <Param
                          key={param.name}
                          data={params}
                          formats={formats}
                          isEdit={is_edit}
                          usingDefaultData={params_using_default}
                          value={param}
                          onParamUsingDefaultChange={
                            this.handleParamUsingDefaultChange
                          }
                          onPrefChange={this.handlePrefChange}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </>
          );
        }}
      </SaveDialog>
    );
  }
}

Dialog.propTypes = {
  active: PropTypes.yesno,
  configs: PropTypes.array,
  formats: PropTypes.array,
  gmp: PropTypes.gmp.isRequired,
  name: PropTypes.string,
  params: PropTypes.object,
  reportconfig: PropTypes.model,
  summary: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onValueChange: PropTypes.func,
};

export default withGmp(Dialog);
