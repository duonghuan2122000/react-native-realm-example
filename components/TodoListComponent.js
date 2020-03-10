import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {
  queryAllTodoLists,
  deleteTodoList,
  deleteAllTodoLists,
  filterTodoLists,
} from '../databases/allSchemas';
import PopupDialogComponent from './PopupDialogComponent';
import HeaderComponent from './HeaderComponent';
import {SORT_ASCENDING, SORT_DESCENDING} from './sortState';
let ItemList = props => {
  const {item, onPressItem, itemIndex} = props;
  return (
    <TouchableOpacity onPress={onPressItem}>
      <View
        style={{
          backgroundColor: itemIndex % 2 == 0 ? 'powderblue' : 'skyblue',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18, margin: 10}}>
          {item.name}
        </Text>
        <Text style={{fontSize: 18, margin: 10}}>
          {item.creationDate.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

let ItemListAction = props => {
  const {popupDialogComponent, item, rowMap, reloadData} = props;
  let closeRow = () => {
    rowMap[item.id].closeRow();
  };
  let showEditModal = () => {
    closeRow();
    popupDialogComponent.showDialogComponentForUpdate({
      id: item.id,
      name: item.name,
    });
  };

  let showDeleteConfirmation = () => {
    closeRow();
    deleteTodoList(item.id)
      .then()
      .catch(err => alert(`Delete todoList error ${err}`));
    reloadData();
  };
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
      <TouchableOpacity
        onPress={showEditModal}
        style={{
          backgroundColor: 'rgb(81, 134, 237)',
          alignItems: 'center',
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          width: 75,
          right: 75,
        }}>
        <Text>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={showDeleteConfirmation}
        style={{
          backgroundColor: 'rgb(217, 88, 64)',
          alignItems: 'center',
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          width: 75,
          right: 0,
        }}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default class TodoListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todoLists: [],
      sortState: SORT_ASCENDING,
      searchedName: '',
    };
  }

  componentDidMount() {
    this.reloadData();
  }

  sort = () => {
    this.setState({
      sortState:
        this.state.sortState === SORT_ASCENDING
          ? SORT_DESCENDING
          : SORT_ASCENDING,
      todoLists: this.state.todoLists.sorted(
        'name',
        this.state.sortState === SORT_DESCENDING ? true : false,
      ),
    });
  };

  reloadData = () => {
    queryAllTodoLists()
      .then(todoLists => this.setState({todoLists}))
      .catch(e => this.setState({todoLists: []}));
  };

  deleteAllTodoLists = () => {
    Alert.alert('Alert', 'Do you want to delete all TodoLists', [
      {text: 'Cancel', onPress: null},
      {
        text: 'Ok',
        onPress: () => {
          deleteAllTodoLists()
            .then()
            .catch(err => alert(`Error ${err}`));
          this.reloadData();
        },
      },
    ]);
  };

  setPopupDialogComponent = el => (this.popupDialogComponent = el);

  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent
          hasAddDeleteAllButton={true}
          hasAddButton={true}
          showAddTodoList={() =>
            this.popupDialogComponent.showDialogComponentForAdd()
          }
          deleteAllTodoLists={this.deleteAllTodoLists}
          hasSortButton={true}
          sort={this.sort}
          sortState={this.state.sortState}
          title="Todo List"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter text to search"
          autoCorrect={false}
          onChangeText={text => {
            this.setState({searchedName: text});
            if (text.length == 0 || text == '') {
              this.reloadData();
            } else {
              filterTodoLists(text)
                .then(filteredTodoLists => {
                  this.setState({todoLists: filteredTodoLists});
                })
                .catch(err => this.setState({todoLists: []}));
            }
          }}
          value={this.state.searchedName}
        />
        <SwipeListView
          style={styles.flatList}
          data={this.state.todoLists}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <ItemList item={item} itemIndex={index} />
          )}
          renderHiddenItem={({item}, rowMap) => (
            <ItemListAction
              popupDialogComponent={this.popupDialogComponent}
              rowMap={rowMap}
              item={item}
              reloadData={this.reloadData}
            />
          )}
          rightOpenValue={-150}
          disableRightSwipe={true}
          closeOnRowPress={true}
        />
        <PopupDialogComponent
          reloadData={this.reloadData}
          ref={this.setPopupDialogComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  flatList: {
    flex: 1,
    flexDirection: 'column',
  },
  textInput: {
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
