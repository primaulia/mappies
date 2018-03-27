import React from 'react'
import styled from 'styled-components'
import { Title } from 'reactbulma'

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

const legSummary = ({distance, duration, maneuver}) => {
  if(roundDistance(duration) === 0 && roundTime(duration) === 0) return ''

  if (maneuver.instruction.includes('Head')) {
    return ` for about ${roundTime(duration)} minute(s)`
  } else {
    return ` for about ${roundDistance(distance)} meters`
  }
}


export default (
  {directions: 
    { summary, steps, name }
  }
) => {
  const instructions = steps && steps.map((step, index) => {
    return (
      <li key={index}>
        {step.maneuver.instruction}{legSummary(step)}
      </li>
    )
  })

  if(steps) {
    return (
      <Directions>
        <Title is="3">{name}</Title>
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