import React from 'react';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import {geolocated} from 'react-geolocated';
import styled from 'styled-components';
import { 
  Container, 
  Hero, 
  Title, 
  Section,
  Input 
} from 'reactbulma'

const MAPTOKEN = "pk.eyJ1IjoicHJpbWF1bGlhIiwiYSI6ImNqZjZmZHpzNDF2eTEzM3BkcHlzYnpibHkifQ.NJiLEHo6gdamdnQWphTo9Q"

const geocodingUrl = 'https://api.mapbox.com/geocoding/v5';
const mapboxGeocoding = (query) =>
  `${geocodingUrl}/mapbox.places/${query}.json?access_token=${MAPTOKEN}`;
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
`;

class App extends React.Component {
  constructor(props) {
    super(props)
    const {coords} = props
    this.state = {
      mapConfig: {
        coords,
        containerStyle: {
          height: "80vh",
          width: "100%"
        },
        style: "mapbox://styles/mapbox/streets-v9",
        zoom: [12],
        center: [103.8198, 1.3521]
      }
    }
  }

  find(query) {
    console.log(query)
    fetch(req(mapboxGeocoding(query)))
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          options: data.features
            .filter((place) => place.place_type.includes('poi'))
            .map((poi) => ({
              id: poi.id,
              center: poi.center,
              name: poi.text
            }))
        });

        console.log(this.state.options)
      });
  };

  onChange(query) {
    this.setState({ query });
    this.find(query);
  }

  render() {
    const {mapConfig} = this.state
    return (
      <div>
        <Section>
          <Container fluid>
            <Input 
              id="search" 
              medium
              type="text"
              placeholder="Where do you want to go?"
              onChange={(e) => this.onChange(e.target.value)}
            >
            </Input>
            <Section>
              {mapConfig && 
                <Map {...mapConfig}>
                  <Marker coordinates={mapConfig.center}>
                    <Mark />
                  </Marker>
                </Map>
              }
            </Section>
          </Container>
        </Section>
        <Hero primary as="section">
          <Hero.Body>
            <Container fluid>
              <Title as="h1">Mappies</Title>
            </Container>
          </Hero.Body>
        </Hero>
      </div>
    );
  }
}

export default geolocated()(App);
