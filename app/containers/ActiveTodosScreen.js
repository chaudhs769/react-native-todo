import React, {Component} from 'react';
import { Text, ListView, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import config from '../config';
import SwipeListView from '../lib';

import * as TodoActionCreators from '../redux/actions/TodoActionCreators';

import Title from '../components/Title';
import Input from '../components/Input';
import TodoRowItem from '../components/TodoRowItem';
import DateView from '../components/DateView';

import styles from './styles/ActiveTodosStyles';
import commonStyles from './styles';


class ActiveTodosScreen extends Component {

  render() {
    const {todosReducer} = this.props;
    const {active} = todosReducer;
    const {todos} = active;
    const {addTodo, completeTodo, deleteActiveTodo} = this.props;

    this.leftOpenValue = Dimensions.get('window').width;
    this.rightOpenValue = -Dimensions.get('window').width;

    return (
      <View style={commonStyles.container} >
        { Title(config.constants.active_todos_screen.title) }
        <View style={styles.header}>
          <View style={styles.inputContainer}>
            <Input
              placeholder={config.constants.active_todos_screen.add_todo_placeholder}
              placeholderTextColor={config.colors.white}
              selectionColor={config.colors.golden}
              underlineColorAndroid={config.colors.transparent}
              maxLength={config.constants.active_todos_screen.add_todo_input_maxlength}
              clearTextOnFocus={config.constants.active_todos_screen.add_todo_input_clear_text_on_focus}
              onSubmitEditing={addTodo}
            />
          </View>
          <DateView />
        </View>
        <SwipeListView
          data={todos}
          keyExtractor={todo => todo.id}
          enableEmptySections={true}
          renderItem={(item, index) => (
            <TodoRowItem
              todo={{...item}}
              index={index}
              time={moment().startOf('hour').fromNow()}
            />
          )}
          renderLeftRow={(item, index) => (
    				<View style={commonStyles.rowLeft}>
              <Icon
                 style={commonStyles.icon}
                 name={config.icons.check}
                 size={config.constants.hidden_row_icon_size}
               />
    				</View>
    			)}
          renderRightRow={(item, index) => (
    				<View style={commonStyles.rowRight}>
               <Icon
                  style={commonStyles.icon}
                  name={config.icons.times}
                  size={config.constants.hidden_row_icon_size}
                />
    				</View>
    			)}
          renderSeparator={() => (
            <View style={commonStyles.separator} />
          )}
          swipeDuration={config.constants.row_swipe_duration}
          swipeToOpenPercent={config.constants.row_swipe_open_percent}
          leftOpenValue={this.leftOpenValue}
          rightOpenValue={this.rightOpenValue}
          onSwipedLeft={deleteActiveTodo}
          onSwipedRight={(index) => {
            completeTodo(index);
            deleteActiveTodo(index);
          }}
         />
      </View>
    );
  };

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(TodoActionCreators, dispatch);
};

const mapStateToProps = (state) => ({
  todosReducer: state.todosReducer,
  nav: state.nav,
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTodosScreen);
