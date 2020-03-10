/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import TodoListComponent from './components/TodoListComponent.js';

AppRegistry.registerComponent(appName, () => TodoListComponent);
