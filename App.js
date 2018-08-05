'use strict';
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapView from 'react-native-maps';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  CameraRoll, 
  Image, 
  TouchableHighlight, 
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { photos: undefined };
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then(r => this.setState({ photos: r.edges }))
    .catch((err) => {
      //Error Loading Images
      console.log(err);
   });
  }

  componentDidMount = () => 
  {
    this.getPhotos();
  }

  setIndex = (index) =>
  {
    let picked = this.state.photos[index];

    Alert.alert('Photo Selected', `Lng: ${picked.node.location.longitude} Lat: ${picked.node.location.latitude}`);
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {this.state.photos && 
            <ScrollView
            contentContainerStyle={styles.scrollView}>
            {
              this.state.photos.map((p, i) => {
                return (
                  <TouchableHighlight
                    style={{opacity: i === this.state.index ? 0.5 : 1}}
                    key={i}
                    underlayColor='transparent'
                    onPress={() => this.setIndex(i)}
                  >
                    <Image
                      style={{
                        width: width / 3,
                        height: width / 3,
                      }}
                      source={{uri: p.node.image.uri}}
                    />
                  </TouchableHighlight>
                )
              })
            }
          </ScrollView>
          }

          {!this.state.photos && 
            <Text style={styles.welcome}>I didn't find photos!</Text>
          }
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 25,
    backgroundColor: '#F5FCFF',
  },
  imageContainer: {
    flex: 0.4,
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 0.6, 
    flexDirection: 'column', 
    borderColor: '#ccc',
    borderWidth: 2,
    alignSelf: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
