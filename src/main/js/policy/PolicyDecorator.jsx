import React from 'react';

export default function decorate(option) {
  if (!option) throw new Error('option must be specified');
  if (!option.fields) throw new Error('option.fields must be specified');
  if (!option.form) throw new Error('option.form must be defined');
  if (!option.validator) throw new Error('option.validator must be defined');

  return (Component) => {
    const DecoratedComponent = class extends React.Component {
      getValue(e) {
        const { type, value, checked } = e.target;
        if (type === 'checkbox') {
          return checked;
        }
        return value;
      }
      onChange(e) {
        this.props.onChange(option.form, e.target.name, this.getValue(e));
      }

      getFieldProps(fieldName) {
        return {
          onChange: this.onChange.bind(this),
          name: fieldName,
          testRef: fieldName,
          value: this.props.values[fieldName],
          checked: this.props.values[fieldName],
        };
      }

      getValidationProps(validationResult, fieldName) {
        const { valid, message } = validationResult[fieldName] || { valid: true };

        if (valid) {
          return { valid };
        }

        return {
          valid,
          hasFeedback: true,
          bsStyle: 'error',
          help: message,
        };
      }

      getFields() {
        const validationResult = option.validator(this.props.values);

        const output = {};
        option.fields.map((fieldName) => {
          output[fieldName] = {
            ...this.getFieldProps(fieldName),
            ...this.getValidationProps(validationResult, fieldName),
          };
        });
        return output;
      }

      render() {
        return (
          <Component
            {...this.props}
            testRef="IC"
            fields={this.getFields()}
            policyId={this.props.policyId}
          />);
      }
    };
    DecoratedComponent.originalName = Component.name;
    DecoratedComponent.displayName = `PD${Component.name}`;
    DecoratedComponent.innerTestRef = 'IC';
    DecoratedComponent.innerComponentRef = 'IC';
    DecoratedComponent.option = option;
    DecoratedComponent.propTypes = {
      onChange: React.PropTypes.func.isRequired,
      values: React.PropTypes.object.isRequired,
      policyId: React.PropTypes.number.isRequired,
    };

    return DecoratedComponent;
  };
}
