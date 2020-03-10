import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {SORT_ASCENDING, SORT_DESCENDING} from './sortState';
export default class HeaderComponent extends Component {
  render() {
    const {
      showAddTodoList,
      hasAddButton,
      hasAddDeleteAllButton,
      deleteAllTodoLists,
      hasSortButton,
      sort,
      sortState,
      title,
    } = this.props;
    var sortIcon =
      sortState === SORT_ASCENDING
        ? require('../images/up.png')
        : require('../images/down.png');
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        {hasAddButton && (
          <TouchableOpacity style={styles.addButton} onPress={showAddTodoList}>
            <Image
              style={styles.addButtonImage}
              source={require('../images/add.png')}
            />
          </TouchableOpacity>
        )}
        {hasSortButton && (
          <TouchableOpacity style={styles.addButton} onPress={sort}>
            <Image style={styles.addButtonImage} source={sortIcon} />
          </TouchableOpacity>
        )}
        {hasAddDeleteAllButton && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={deleteAllTodoLists}>
            <Image
              style={styles.addButtonImage}
              source={require('../images/delete.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgb(224, 93, 144)',
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 50,
  },
  addButton: {
    zIndex: 2,
    marginTop: 30,
    marginRight: 10,
  },
  addButtonImage: {
    width: 26,
    height: 26,
    tintColor: 'white',
  },
});
