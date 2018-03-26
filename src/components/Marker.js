import React from 'react'
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const MarkTemplate = ({className, emit, coordinate}) => (
  <div className={className}  onClick={(e) => emit(coordinate)}>
  </div>
)

const Mark = styled(MarkTemplate)`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 4px solid #eaa29b;
`;

const Destination = Mark.extend`
  background-color: #FFD23F;
  border: 4px solid #FFE696;
  width: 20px;
  height: 20px;
  cursor: pointer;
  animation: ${blink} 2s linear infinite;
`;

export {
  Mark,
  Destination
}