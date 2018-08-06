'use strict';
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  Platform, 
  StyleSheet, 
  View, 
  Alert,
  AppState,
  CameraRoll,
} from 'react-native';
import PhotoList from './components/photoList';
import Map from './components/map';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      isLoading: false,
      appState: AppState.currentState,
      region: {
        latitude: 37.78825, // San Francisco (default view)
        longitude: -122.4324,
        latitudeDelta: 0.5, // 0.0922,
        longitudeDelta: 0.5, //0.0421,
      },
    };
  }

  getPhotos = () => {
    this.setState({isLoading: true});

    CameraRoll.getPhotos({
      first: this.state.photos.length + 21,
    })
    .then(r => {
      this.setState({ photos: r.edges });
      this.setState({isLoading: false});
    })
    .catch((err) => {
      //Error Loading Images
      console.log(err);
   });
  }

  componentDidMount = () => {
    this.getPhotos();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({photos: []});
      this.getPhotos();
    }

    this.setState({appState: nextAppState});
  }

  setIndex = (index) =>
  {
    let picked = this.state.photos[index];
    let isValidLocation = true;

    if(!picked) {
      this.showAlert({
        title: 'Photo Not Selected',
        message: 'No photo was selected.' 
      });

      isValidLocation = false;
    }

    if(!picked.node.location.longitude || !picked.node.location.latitude) {
      this.showAlert({
        title: 'No Location Data Found',
        message: 'No location information exists on the selected photo.' 
      });

      isValidLocation = false;
    }

    if(isValidLocation)
    {
      let region = {
        longitude: picked.node.location.longitude,
        latitude: picked.node.location.latitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      this.setState({ region: region });
    }
  }

  showAlert = (data) => {
    Alert.alert(data.title, data.message,
      [
        {text: 'OK', onPress: () => { 
          console.log('OK Pressed');
        }},
      ],
      { cancelable: false });
  }

  render = () => {
    return (
      <View style={styles.container}>
        <PhotoList 
          isLoading={this.state.isLoading} 
          photos={this.state.photos} 
          index={this.state.index} 
          getPhotos={this.getPhotos} 
          setIndex={this.setIndex}
        />

        <Map region={this.state.region} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 35,
    backgroundColor: '#F5FCFF',
  },
});
