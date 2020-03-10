import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Modal, {ModalTitle} from 'react-native-modals';
import {insertNewTodoList, updateTodoList} from '../databases/allSchemas';
export default class PopupDialogComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      name: '',
      isAddNew: true,
      dialogTitle: '',
      isShow: false,
    };
  }

  closePopupDialog = () => {
    this.setState({isShow: false});
  };
  saveTodoList = () => {
    if (this.state.name.trim() == '') {
      alert('Please enter todoList name');
      return;
    }
    this.closePopupDialog();
    if (this.state.isAddNew == true) {
      const newTodoList = {
        id: Math.floor(Date.now() / 1000),
        name: this.state.name,
        creationDate: new Date(),
      };
      insertNewTodoList(newTodoList)
        .then()
        .catch(err => alert(`Insert new todoList err: ${err}`));
    } else {
      const todoList = {
        id: this.state.id,
        name: this.state.name,
      };
      updateTodoList(todoList)
        .then()
        .catch(err => alert(`Update todoList error ${err}`));
    }
    this.props.reloadData();
  };
  showDialogComponentForAdd = () => {
    this.setState({
      id: 0,
      name: '',
      isAddNew: true,
      dialogTitle: 'Add New TodoList',
      isShow: true,
    });
  };

  showDialogComponentForUpdate = existingTodoList => {
    this.setState({
      id: existingTodoList.id,
      name: existingTodoList.name,
      isAddNew: false,
      dialogTitle: 'Update a TodoList',
      isShow: true,
    });
  };

  render() {
    return (
      <Modal
        width={0.7}
        height={180}
        visible={this.state.isShow}
        modalTitle={<ModalTitle title={this.state.dialogTitle} />}>
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter TodoList name"
            autoCorrect={false}
            onChangeText={text => this.setState({name: text})}
            value={this.state.name}
          />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button} onPress={this.saveTodoList}>
              <Text style={styles.textLabel}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.closePopupDialog}>
              <Text style={styles.textLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: 'steelblue',
    padding: 10,
    margin: 10,
  },
  textLabel: {
    color: 'white',
    fontSize: 18,
  },
});
