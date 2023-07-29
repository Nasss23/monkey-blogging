import React from "react";
import styled from "styled-components";
import { useController } from "react-hook-form";

const TextAreaStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    padding: 16px 20px;
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    border-radius: 8px;
    transition: all 0.2s linear;
    color: ${(props) => props.theme.black};
    font-size: 14px;
    resize: none;
    
    min-height: 200px;
  }
  textarea::-webkit-input-placeholder {
    color: #b2b3bd;
  }
  textarea::-moz-input-placeholder {
    color: #b2b3bd;
  }
`;
const TextArea = ({ name = "", type = "text", children, control, ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <TextAreaStyles>
      <textarea id={name} type={type} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div> : null}
    </TextAreaStyles>
  );
};

export default TextArea;
