import React from 'react'
import styled from 'styled-components';
import {
  Title,
  SubTitle
} from 'reactbulma'

const Directions = styled.div`
  display: inline-block; 
  vertical-align: top;
  width: 26%; 
`

const StyledUl = styled.ul`
  list-style: square; 
`

const roundDistance = (distance) => {
  return Math.round(distance / 50) * 50;
}

const roundTime = (duration) => {
  return Math.floor(duration/60)
}

const legSummary = ({distance, duration}) => {
  if(roundDistance(duration) === 0 && roundTime(duration) === 0) return ''

  if (roundTime(duration) <= 0) {
    return ` for about ${roundDistance(distance)} meters`
  } else {
    return ` for about ${roundTime(duration)} minute(s)`
  }
}


export default (
  {directions: 
    { summary, steps }
  }
) => {
  const instructions = steps && steps.map((step, index) => {
    return (
      <li key={index}>
        {step.maneuver.instruction}{legSummary(step)}
      </li>
    )
  })

  if(summary) {
    return (
      <Directions>
        <Title is="3">Directions</Title>
        <SubTitle>{summary.split(',').join(' - ')}</SubTitle>
        <StyledUl>
          { instructions }
        </StyledUl>
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