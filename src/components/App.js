import React from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import {
  Container,
  Section
} from 'reactbulma'
import styled from 'styled-components';

// Custom components
import SearchBar from './SearchBar'
import { Mark, Destination } from './Marker'
import Directions from './Directions'
import Footer from './Footer'

// Helper functions
import { serialize, req } from '../helpers'

const MAPTOKEN = 'pk.eyJ1IjoicHJpbWF1bGlhIiwiYSI6ImNqZjZmZHpzNDF2eTEzM3BkcHlzYnpibHkifQ.NJiLEHo6gdamdnQWphTo9Q'
const GEOCODINGURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const DIRECTIONURL = 'https://api.mapbox.com/directions/v5/mapbox/walking/'

const Map = ReactMapboxGl({
  accessToken: MAPTOKEN
});

const StyledMap = styled(Map)`
  display: inline-block
  margin-right: 40px;
`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mapConfig: {},
      pois: [],
      typing: false,
      typingTimeOut: 0,
      directions: {}
    }
  }
  
  mapboxGeocoding = (query, nearbySearch) => {
    const params = {
      types: nearbySearch ? 'poi.landmark' : 'address,poi',
      limit: nearbySearch ? 3 : 1,
      access_token: MAPTOKEN,
      country: 'sg',
    }

    if(nearbySearch) params.proximity = query

    return `${GEOCODINGURL}${encodeURIComponent(query)}.json?${serialize(params)}`;
  } 
  
  mapboxDirection = (c1, c2) => {
    const params = {
      access_token: MAPTOKEN,
      steps: true,
    }

    return `${DIRECTIONURL}${encodeURIComponent(`${c1};${c2}`)}.json?${serialize(params)}`;
  }

  async whereAmI(query = '8 Claymore Hill', zoomFactor) {
    if(query === '') return

    const response = await fetch(
      req(
        this.mapboxGeocoding(query, false)
      )
    )
    const data = await response.json()

    if (data.features && data.features[0]) {
      const center = data.features[0].center
      if (center) {
        this.orientate(center, zoomFactor)
      }
    }
  }

  orientate(center, zoom = 11) {
    this.setState({
      mapConfig: {
        containerStyle: {
          height: "80vh",
          width: "75%"
        },
        style: "mapbox://styles/mapbox/streets-v9",
        zoom: [zoom],
        center,
      },
    }); 
  }

  async populateLandmarks(center) {
    const response = await fetch(
      req(
        this.mapboxGeocoding(center, true)
      )
    )
    const data = await response.json()
    const pois = data.features

    if(pois) {
      this.setState({
        pois: pois.map(({ id, center, text }) => ({
          id,
          center,
          text
        }))
      })
    }
  }

  async getDirection(c1, c2) {
    const response = await fetch(
      req(
        this.mapboxDirection(c1, c2)
      )
    )
    const data = await response.json()
    if(data) {
      const { legs } = data.routes[0]
      const { summary, steps } = legs[0]

      this.setState({
        directions: {
          summary,
          steps
        }
      })
  
      console.log(summary)
      console.log(steps)
    }
  }

  handleChange = (query) => {
    // ref: delay find function only upon typing event fully finished
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    
    this.setState({
      typing: false,
      typingTimeout: setTimeout(async () => {
        await this.whereAmI(query, 16) // need to wait for whereAmI async fn to finish
        const center = this.state.mapConfig.center
        this.populateLandmarks(center)
      }, 3000)
    });
    
  }

  handleClick = (destinationCoordinate) => {
    console.log(`center: ${this.state.mapConfig.center}`)
    console.log(`destinationCoordinate: ${destinationCoordinate}`)
    const startCoordinate = this.state.mapConfig.center
    this.getDirection(startCoordinate, destinationCoordinate)
  }

  render() {
    const { mapConfig, pois, directions } = this.state
    const poiComp = pois.map(({ id, name, center }) =>
      <Marker key={id} coordinates={center}>
        <Destination coordinate={center} emit={this.handleClick} />
      </Marker>
    )

    return (
      <div>
        <Section>
          <Container fluid>
            <SearchBar onSearch={this.handleChange} />
            <Section>
              {mapConfig.center &&
                <StyledMap {...mapConfig}>
                  <Marker coordinates={mapConfig.center}>
                    <Mark />
                  </Marker>

                  {poiComp}
                </StyledMap>
              }
              <Directions directions={directions} />
            </Section>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    // default orientation
    this.whereAmI()
  }
}

export default App;
