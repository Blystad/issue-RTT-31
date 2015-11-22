import React from 'react';
import { Input } from 'react-bootstrap';

import policy from '../PolicyDecorator.jsx';
import { SIPServer } from '../PolicyValidator.jsx';

const policyConfig = {
  form: 'SIPServer',
  fields: ['sipServerName', 'sipServerAddress'],
  validator: SIPServer,
};
class SIPServerCustom extends React.Component {
  render() {
    const { sipServerName, sipServerAddress } = this.props.fields;
    return (
      <div>
        <Input type="text" {...sipServerName} label="Server Name" wrapperClassName="col-xs-10" labelClassName="col-xs-2" />
        <Input type="text" {...sipServerAddress} label="Server Address" />
      </div>
    );
  }
}
SIPServerCustom.propTypes = {
  fields: React.PropTypes.object,
};

export default policy(policyConfig)(SIPServerCustom);
