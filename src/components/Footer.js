import React from 'react'
import { 
  Container, 
  Hero, 
  Title,
} from 'reactbulma'

export default () => {
  return (
    <Hero primary as="section">
      <Hero.Body>
        <Container fluid>
          <Title as="h1">WalkyMappy</Title>
        </Container>
      </Hero.Body>
    </Hero>
  )
}