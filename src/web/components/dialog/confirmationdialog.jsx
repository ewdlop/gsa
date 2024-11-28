/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React, {useCallback} from 'react';

import PropTypes from 'web/utils/proptypes';

import Dialog from 'web/components/dialog/dialog';
import DialogContent from 'web/components/dialog/content';
import DialogTwoButtonFooter, {
  DELETE_ACTION,
} from 'web/components/dialog/twobuttonfooter';

import useTranslation from 'web/hooks/useTranslation';

const DEFAULT_DIALOG_WIDTH = '400px';

const ConfirmationDialogContent = ({
  content,
  close,
  rightButtonTitle,
  onResumeClick,
  loading,
  rightButtonAction,
}) => {
  const handleResume = useCallback(() => {
    if (onResumeClick) {
      onResumeClick();
    }
  }, [onResumeClick]);

  return (
    <DialogContent>
      {content}
      <DialogTwoButtonFooter
        rightButtonTitle={rightButtonTitle}
        onLeftButtonClick={close}
        onRightButtonClick={handleResume}
        loading={loading}
        rightButtonAction={rightButtonAction}
      />
    </DialogContent>
  );
};

ConfirmationDialogContent.propTypes = {
  close: PropTypes.func.isRequired,
  content: PropTypes.elementOrString,
  rightButtonTitle: PropTypes.string,
  onResumeClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  rightButtonAction: PropTypes.oneOf([undefined, DELETE_ACTION]),
};

const ConfirmationDialog = ({
  width = DEFAULT_DIALOG_WIDTH,
  content,
  title,
  rightButtonTitle,
  rightButtonAction,
  onClose,
  onResumeClick,
  loading,
}) => {
  const [_] = useTranslation();

  rightButtonTitle = rightButtonTitle || _('OK');
  return (
    <Dialog width={width} onClose={onClose} title={title}>
      {({close}) => (
        <ConfirmationDialogContent
          close={close}
          content={content}
          rightButtonTitle={rightButtonTitle}
          onResumeClick={onResumeClick}
          loading={loading}
          rightButtonAction={rightButtonAction}
        />
      )}
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  content: PropTypes.elementOrString,
  rightButtonTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  width: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onResumeClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  rightButtonAction: PropTypes.oneOf([undefined, DELETE_ACTION]),
};

export default ConfirmationDialog;
