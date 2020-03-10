import Realm from 'realm';
export const TODOLIST_SCHEMA = 'todolists';

export const TODO_SCHEMA = 'todos';

export const Todo_Schema = {
  name: TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: {type: 'string', indexed: true},
    done: {type: 'bool', default: false},
  },
};

export const TodoList_Schema = {
  name: TODOLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    creationDate: 'date',
    todos: {type: 'list', objectType: TODO_SCHEMA},
  },
};

const databaseOptions = {
  path: 'example.realm',
  schema: [Todo_Schema, TodoList_Schema],
  schemaVersion: 0, // optional
};

export const insertNewTodoList = newTodoList =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(TODOLIST_SCHEMA, newTodoList);
          resolve(newTodoList);
        });
      })
      .catch(error => reject(error));
  });

export const updateTodoList = todoList =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let updatingTodoList = realm.objectForPrimaryKey(
            TODOLIST_SCHEMA,
            todoList.id,
          );
          updatingTodoList.name = todoList.name;
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteTodoList = todoListId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let deletingTodoList = realm.objectForPrimaryKey(
            TODOLIST_SCHEMA,
            todoListId,
          );
          realm.delete(deletingTodoList);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteAllTodoLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let allTodoLists = realm.objects(TODOLIST_SCHEMA);
          realm.delete(allTodoLists);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const queryAllTodoLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let allTodoLists = realm.objects(TODOLIST_SCHEMA);
          resolve(allTodoLists);
        });
      })
      .catch(error => reject(error));
  });

export const filterTodoLists = searchedText =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let filteredTodoLists = realm
          .objects(TODOLIST_SCHEMA)
          .filtered(`name CONTAINS[c] "${searchedText}"`); //[c] = case insensitive
        resolve(filteredTodoLists);
      })
      .catch(err => reject(err));
  });
