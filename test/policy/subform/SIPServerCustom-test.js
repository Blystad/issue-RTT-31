/* global define, it, describe, before, expect, sinon */
import policyTestCase from '../PolicyTestUtils';

import SIPServerCustom from '../../../src/main/js/policy/subform/SIPServerCustom.jsx';

const values = {
  sipServerName: 'cake',
  sipServerAddress: 'sip.cake.com',
};

policyTestCase(SIPServerCustom, values, (context) => {
  const { render, root } = context;

  context.expectForm('SIPServer');

  it('should require that sipServerName is specified', () => {
    render({ sipServerName: '' });
    expect(root().sipServerName).to.not.validate();

    render({ sipServerName: 'asdkwad' });
    expect(root().sipServerName).to.validate();
  });
}, { props: { server: 'custom' } });
