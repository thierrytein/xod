import * as R from 'ramda';
import { ERROR_CODES as XFS_EC } from 'xod-fs';

// import COMPILATION_ERRORS using path to file to prevent importing the whole package,
// that contains async/await functions and non-isomorphic dependencies
import { COMPILATION_ERRORS as XD_EC } from 'xod-deploy/dist/constants';

import composeMessage from './composeMessage';
import * as EC from './errorCodes';

const UNKNOWN_ERROR = err =>
  composeMessage('Unknown error occurred', err.message || JSON.stringify(err));

const ERROR_FORMATTERS = {
  // Errors that will showed in the upload popup
  [EC.TRANSPILE_ERROR]: err => `Error occurred during transpilation: ${err}`,
  [EC.PORT_NOT_FOUND]: err =>
    `Could not find Arduino device on port: ${
      err.port.comName
    }. Available ports: ${R.map(R.prop('comName'), err.ports)}`,
  [EC.UPLOAD_ERROR]: err => `Error occured during uploading: ${err}`,
  [EC.INDEX_LIST_ERROR]: err =>
    `Could not connect to Arduino Packages Index at ${err.request.path}: ${
      err.error.message
    }`,
  [EC.CANT_INSTALL_ARCHITECTURE]: err => `Could not install tools: ${err}`,

  // Snackbar errors
  [XFS_EC.INVALID_WORKSPACE_PATH]: err =>
    composeMessage(
      'Invalid workspace path',
      `"${err.path}" of type "${typeof err.path}"`
    ),
  [XFS_EC.WORKSPACE_DIR_NOT_EMPTY]: err =>
    composeMessage(`Workspace directory at ${err.path} is not empty`),
  [XFS_EC.WORKSPACE_DIR_NOT_EXIST_OR_EMPTY]: err =>
    composeMessage(`Workspace directory at ${err.path} not exist or empty`),

  [XFS_EC.INVALID_FILE_CONTENTS]: err =>
    composeMessage(
      'Canʼt open selected project',
      `Invalid contents in ${err.path}`
    ),

  [XFS_EC.CANT_CREATE_WORKSPACE_FILE]: err =>
    composeMessage(`Could not create workspace at ${err.path}`, err.message),
  [XFS_EC.CANT_COPY_STDLIB]: err =>
    composeMessage(`Could not copy stdlib at ${err.path}`, err.message),
  [XFS_EC.CANT_COPY_DEFAULT_PROJECT]: err =>
    composeMessage(
      `Could not copy default project at ${err.path}`,
      err.message
    ),
  [XFS_EC.CANT_ENUMERATE_PROJECTS]: err =>
    composeMessage(`Could not enumerate projects at ${err.path}`, err.message),
  [XFS_EC.CANT_SAVE_PROJECT]: err =>
    composeMessage(`Could not save the project at ${err.path}`, err.message),
  [XFS_EC.CANT_SAVE_LIBRARY]: err =>
    composeMessage(`Could not save the library at ${err.path}`, err.message),

  [EC.CANT_CREATE_NEW_PROJECT]: err =>
    composeMessage('Could not create a new project', err.message),
  [EC.CANT_OPEN_SELECTED_PROJECT]: err =>
    composeMessage('Could not open selected project', err.message),

  [EC.BOARD_NOT_SUPPORTED]: err => `Board ${err.boardId} is not supported yet`,
  [EC.CANT_GET_UPLOAD_CONFIG]: err =>
    `Could not get upload config for board ${err.boardId}. Returned status ${
      err.status
    } ${err.statusText}`,
  [EC.CLOUD_NETWORK_ERROR]: err =>
    composeMessage(
      'Could not connect to cloud service.',
      `Probably you donʼt have an internet connection. Error: ${err.message}`
    ),

  [XD_EC.COMPILE_FAILED]: err =>
    composeMessage('Compilation failed with error', err.message),
  [XD_EC.COMPILE_TIMEDOUT]: err =>
    composeMessage(`Compilation timed out (${err.message}ms expired)`),
  [XD_EC.CLOSED]: err =>
    composeMessage(
      `Connection was closed with reason (${err.closeCode})`,
      err.reason
    ),
  [XD_EC.FAILED]: err =>
    composeMessage(
      `Canʼt establish connection with compile server: (${err.code})`,
      err.message
    ),
};

// :: Error -> String
export default R.compose(
  R.cond,
  R.append([R.T, UNKNOWN_ERROR]),
  R.map(R.over(R.lensIndex(0), R.propEq('errorCode'))),
  R.toPairs
)(ERROR_FORMATTERS);
