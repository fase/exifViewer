'use strict';
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
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
                      width: width/3,
                      height: width/3
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
});
