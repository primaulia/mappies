import React from 'react'
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const MarkTemplate = ({className, emit, coordinate, children}) => (
  <div className={className}  onClick={(e) => emit(coordinate)}>
    {children}
  </div>
)

const Mark = styled(MarkTemplate)`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  min-height: 10em;
  display: table-cell;
  vertical-align: middle;
  color: black;
  text-align: center;
  border: 4px solid #eaa29b;

`;

const Destination = Mark.extend`
  background-color: #FFD23F;
  border: 4px solid #FFE696;
  width: 50px;
  height: 50px;
  cursor: pointer;
  border-radius: 20%;
  padding: 10px;
  animation: ${blink} 4s linear infinite;
`;

export {
  Mark,
  Destination
}