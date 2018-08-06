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
  Text, 
  View, 
  CameraRoll, 
  Image, 
  TouchableHighlight, 
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.map = React.createRef();

    this.state = {
      photos: [],
      isLoading: false,
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
      this.map.current.animateToRegion(region, 2000);
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

  handleScrollSizeChange = (width, height) => {
    let x = '';
  }

  handleScrollMomentumEnd = () => {
    if (!this.state.isLoading) {
      this.getPhotos();
    }
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {this.state.photos && 
            <ScrollView 
              contentContainerStyle={styles.scrollView} 
              onContentSizeChange={this.handleScrollSizeChange}
              onMomentumScrollEnd={this.handleScrollMomentumEnd}
            >
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
                      style={styles.scrollViewImage} 
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

        {this.state.isLoading && 
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        }

        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={this.map} 
            style={styles.map}
            initialRegion={this.state.region}
          >
              <Marker
                coordinate={{
                  latitude: this.state.region.latitude, 
                  longitude: this.state.region.longitude
                }}
              />
          </MapView>
        </View>
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
  imageContainer: {
    flex: 0.5,
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  scrollViewImage: {
    width: width / 3,
    height: width / 3,
  },
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
