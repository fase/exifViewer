'use strict';
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  StyleSheet, 
  View, 
} from 'react-native';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  componentDidUpdate = () => {
    if(this.props.region) {
      this.map.current.animateToRegion(this.props.region, 2000);
    }
  }

  render = () => {
    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={this.map} 
          style={styles.map}
          initialRegion={this.props.region}
        >
            <Marker
              coordinate={{
                latitude: this.props.region.latitude, 
                longitude: this.props.region.longitude
              }}
            />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 0.5, 
    flexDirection: 'column', 
    borderColor: '#ccc',
    borderWidth: 2,
    alignSelf: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
