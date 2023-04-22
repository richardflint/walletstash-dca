import React from "react";
import { render } from "react-dom";
import Select from "react-select";

class SearchSelect extends React.Component {
    static defaultProps = {
      isDisabled: false
    };
  
    handleChange = value => {
      // this is going to call setFieldValue and manually update values[this.props.name]
      this.props.onChange(this.props.name, value);
    };
  
    handleBlur = () => {
      // this is going to call setFieldTouched and manually update touched[this.props.name]
      this.props.onBlur(this.props.name, true);
    };
  
    render() {
      return (
        <>
          <Select
            id={this.props.name}
            name={this.props.name}
            options={this.props.options}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
            isDisabled={this.props.isDisabled}
          />
          {!!this.props.error && this.props.touched && (
            <div style={{ color: "red", marginTop: ".5rem" }}>
              {Object.values(this.props.error)}
            </div>
          )}
        </>
      );
    }
  }

  export default SearchSelect;