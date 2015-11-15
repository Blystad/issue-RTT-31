import _ from 'lodash';

/*
 Validators
 */
function between(value, begin, end) {
  if (!value) {
    return false;
  }

  if (_.isNumber(value)) {
    return _.inRange(value, begin, end);
  }

  return _.inRange(value.toString().length, begin, end);
}

function notEmpty(value) {
  if (_.isString(value)) {
    return !_.isEmpty(value);
  }

  return !_.isUndefined(value);
}

function numeric(n) {
  return _.isNumber(n);
}

export function SIPServer(policy) {
  return {
    sipServerName: {
      message: 'You must enter a name for the SIP Server (can be anything)',
      valid: policy.server === 'sipido' || notEmpty(policy.sipServerName),
    },
    sipServerAddress: {
      message: 'You must enter the address (domain or IP) of the SIP server',
      valid: policy.server === 'sipido' || notEmpty(policy.sipServerAddress),
    },

    sipUserDomain: {
      message: 'You must enter the domain',
      valid: policy.server === 'sipido' || policy.account === 'custom' || notEmpty(policy.sipUserDomain),
    },
    sipUserName: {
      message: 'You must enter the username',
      valid: policy.server === 'sipido' || policy.account === 'custom' || notEmpty(policy.sipUserName),
    },
    sipUserPassword: {
      message: 'You must enter the password',
      valid: policy.server === 'sipido' || policy.account === 'custom' || notEmpty(policy.sipUserPassword),
    },
  };
}

const validator = {
  SIPServer,
};

export function findAllActiveKeys(pageStatus) {
  return _.keys(pageStatus).filter(page => pageStatus[page].active);
}

export function isAllFieldsValid(validationResult) {
  return _.find(_.keys(validationResult), (field) => !validationResult[field].valid) === undefined;
}

function hasNoErrorKeys(error, page) {
  return _.keys(_.get(error, page, {})).length === 0;
}

export function getPageStatus(policy) {
  const { pageStatus, content, error } = policy;

  const result = _.cloneDeep(pageStatus);
  findAllActiveKeys(pageStatus).forEach(page => {
    const validationResult = validator[page](content[page]);
    result[page].valid = isAllFieldsValid(validationResult) && hasNoErrorKeys(error, page);
  });
  return result;
}

export function isAllActivePagesValid(policy) {
  const { content, pageStatus } = policy;

  const result = findAllActiveKeys(pageStatus)
    .map((page) => isAllFieldsValid(validator[page](content[page])));

  return !_.contains(result, false);
}
