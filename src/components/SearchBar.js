import React from 'react'
import {
  Input
} from 'reactbulma'

export default (props) => {
  return (
    <Input
      id="search"
      medium
      type="text"
      placeholder="Where are you?"
      onChange={e => props.onSearch(e.target.value)}
    />
  )
}