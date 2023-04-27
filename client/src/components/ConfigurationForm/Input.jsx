import React from "react";

const Input = (props) => {
  return (
    <>
      <input
        id={props.name}
        name={props.name}
        type="text"
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        disabled={props.isDisabled}
        className={props.className}
      />
      {!!props.error && !!props.touched && (
        <div style={{ color: "red", marginTop: ".5rem" }}>
          {Object.values(props.error)}
        </div>
      )}
    </>
  );
}

export default Input;
