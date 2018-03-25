import React from 'react';
import { geolocated } from 'react-geolocated';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import styled from 'styled-components';
import {
  Container,
  Section
} from 'reactbulma'

import Geo from './Geo'
import SearchBar from './SearchBar'
import Footer from './Footer'

const MAPTOKEN = 'pk.eyJ1IjoicHJpbWF1bGlhIiwiYSI6ImNqZjZmZHpzNDF2eTEzM3BkcHlzYnpibHkifQ.NJiLEHo6gdamdnQWphTo9Q'
const GEOCODINGURL = 'https://api.mapbox.com/geocoding/v5';

const mapboxGeocoding = (query) =>
  `${GEOCODINGURL}/mapbox.places/${encodeURIComponent(query)}.json?types=poi.landmark&limit=3&access_token=${MAPTOKEN}`;

const req = (url, body, method = 'GET') => {
  return new Request(url, {
    method,
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8'
    }),
    body
  });
}

const Map = ReactMapboxGl({
  accessToken: MAPTOKEN
});

const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #eaa29b;
  cursor: pointer;
`;

const Destination = Mark.extend`
  background-color: #FFD23F;
  border: 4px solid #FFE696;
`;

class App extends React.Component {
  constructor(props) {
    super(props)
    const { coords } = props
    console.log(props)
    this.state = {
      mapConfig: {
        coords,
        containerStyle: {
          height: "80vh",
          width: "100%"
        },
        style: "mapbox://styles/mapbox/streets-v9",
        zoom: [15],
        center: [103.8641291, 1.3232066],
      },
      pois: []
    }
  }

  find(query) {
    fetch(
      req(
        mapboxGeocoding(query)
      )
    ).then((res) => res.json())
      .then((data) => {
        if (data.features) {
          console.log(data.features)
          this.setState({
            pois: data.features
              .map(({ id, center, name }) => ({
                id,
                center,
                name
              }))
          });

          console.log(this.state.options)
        }
      });
  }

  onChange = (query) => {
    this.setState({ query });
    this.find(query);
  }

  render() {
    const { mapConfig, pois } = this.state
    const poiComp = pois.map(({ id, name, center }) =>
      <Marker coordinates={center}>
        <Destination />
      </Marker>
    )

    return (
      <div>
        <Section>
          <Container fluid>
            <SearchBar onSearch={this.onChange} />
            <Section>
              {mapConfig &&
                <Map {...mapConfig}>
                  <Marker coordinates={mapConfig.center}>
                    <Mark />
                  </Marker>

                  {poiComp}
                </Map>
              }
            </Section>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }
}

export default geolocated()(App);
