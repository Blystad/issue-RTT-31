/* global describe, chai, Assertion, sinon, before, it, expect */
import React from 'react/addons';
import testTree from 'react-test-tree';
import _ from 'lodash';
import { util, Assertion } from 'chai';

util.addMethod(chai.Assertion.prototype, 'validate', function validate() {
  const obj = this._obj;

  new Assertion(obj.element, 'expected object.element to exist').to.exist;
  new Assertion(obj.element.props, 'expected object.element.props to exist').to.exist;

  const actual = obj.element.props.valid;
  const expected = true;
  this.assert(actual === expected,
    `expected to PASS validation (${obj.element.props.value}) but got (valid: ${actual})`,
    `expected to FAIL validation (${obj.element.props.value}) but got (valid: ${actual})`
  );
});

function getComponentName(Component) {
  return Component.originalName || Component.displayName || Component.name;
}

function getDescribeFunction(type) {
  return type ? describe[type] : describe;
}

/*
* Policy Test Case
*
* This provides a simple utility for creating Policy Form Tests.
 */
function policyTestCase(Component, values, func, options = {}) {
  const router = () => {};
  router.makeHref = a => a;
  router.isActive = () => false;
  const defaultOptions = {
    context: {
      router,
    },
  };

  getDescribeFunction(options.describe)(getComponentName(Component), () => {
    const onChange = sinon.spy();

    // Render into a container which we can get from a function. This avoids reference issues.
    let rootInstance = null;
    const root = () => rootInstance;

    /*
    * render
    *
    * Render can be used to re-render the current scene with a specific set of values and props.
    *
    * This updates the rootInstance, available from {@code #root()}.
    *
    * @field customValues The custom values will be combined with the current values. This can be also used to force a external,
    * non registered, value, to be set. E.g. forcing `encryption == WPA_PSK`, for testing WiFiEncryptionWPAPSK.
    * @field props The props will be provided to the component, together with whatever props are set in the options.
    * @return void
     */
    function render(customValues = {}, props = {}) {
      const combinedValues = {...values, ...customValues};
      const combinedProps = {...options.props, ...props};
      const combinedOptions = {...defaultOptions, ...options};

      if (rootInstance) {
        rootInstance.dispose();
      }
      rootInstance = testTree(<Component testRef="IC" onChange={onChange} values={combinedValues} policyId={4} {...combinedProps} />, combinedOptions);
    }
    before(render.bind(this));

    // Run a simple test for every field to ensure that they're hooked up correctly.
    // This will fail if there is a key in the values object, which we don't have a reference for, or
    // missing event handling. (i.e. ref is set, but not from expanding the fields.
    _.keys(values).forEach((item) => {
      it(`should contain a input field named ${item}`, () => {
        expect(root().get(item)).to.exist;
      });

      it(`${item} should call onChange, when changed`, () => {
        const value = 'cake';
        root().get(item).simulate.change({ target: { name: item, value }});
        expect(onChange).to.be.calledWith(Component.option.form, item, value);
      });
    });

    function expectForm(formName) {
      it(`should have a formValue of ${formName}`, () => {
        expect(Component.option.form).to.equal(formName);
      });
    }

    func({
      root,
      onChange,
      render,
      expectForm,
    });
  });
}
policyTestCase.only = (Component, values, func, options = {}) => policyTestCase(Component, values, func, {...options, describe: 'only'});
policyTestCase.skip = (Component, values, func, options = {}) => policyTestCase(Component, values, func, {...options, describe: 'skip'});

export default policyTestCase;
