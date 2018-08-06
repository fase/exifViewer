'use strict';
/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableHighlight, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default class PhotoList extends React.Component {
  handleScrollMomentumEnd = () => {
    if (!this.props.isLoading) {
      this.props.getPhotos();
    }
  }

  render = () => {
    return (
      <View style={styles.imageContainer}>
        {this.props.photos && 
          <ScrollView 
            contentContainerStyle={styles.scrollView} 
            onMomentumScrollEnd={this.handleScrollMomentumEnd}
          >
          {
            this.props.photos.map((p, i) => {
              return (
                <TouchableHighlight
                  style={{opacity: i === this.props.index ? 0.5 : 1}}
                  key={i}
                  underlayColor='transparent'
                  onPress={() => this.props.setIndex(i)}
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

        {!this.props.photos && 
          <Text style={styles.welcome}>I didn't find photos!</Text>
        }

        {this.props.isLoading && 
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});