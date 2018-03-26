import React from 'react'
import styled, { keyframes } from 'styled-components';
import {
  Title,
  SubTitle
} from 'reactbulma'

const Directions = styled.div`
  display: inline-block; 
  vertical-align: top;
  width: 20%; 
`

const ul = styled.ul`
  list-style: square; 
`


export default (
  {directions: 
    { summary, steps }
  }
) => {
  const instructions = steps && steps.map((step, index) => {
    return (
      <li key={index}>{step.maneuver.instruction}</li>
    )
  })

  if(summary) {
    return (
      <Directions>
        <Title is="3">Directions</Title>
        <SubTitle>{summary.split(',').join(' - ')}</SubTitle>
        <ul>
          { instructions }
        </ul>
      </Directions>
    )
  } else {
    return (
      <Directions>
        <Title is="3">Let's start with where are you?</Title>
      </Directions>
    )
  }
}