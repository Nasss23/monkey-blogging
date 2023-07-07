import React from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../loading';

const ButtonStyles = styled.button`
    cursor: pointer;
    padding: 0 25px;
    line-height: 1;
    color: white;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    height: ${props => props.height || "66px"};
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
        to right bottom, 
        ${props => props.theme.primary}, 
        ${props => props.theme.secondary}
    );
    &:disabled{
        opacity: 0.5;
        pointer-events: none;
    }
`

const Button = ({
    type = 'button',
    onClick = () => { },
    children,
    ...props
}) => {
    const { isLoading } = props
    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    return (
        <ButtonStyles type={type} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

export default Button;