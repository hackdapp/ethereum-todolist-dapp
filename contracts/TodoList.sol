//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;
import "./ITodoList.sol";

contract TodoList is ITodoList {

  TodoItem[] public todoItems;

  struct TodoItem {
    bytes32 value;
    bool active;
  }

  function addTodoItem(bytes32 _value) external override returns (bytes32, bool) {
    TodoItem memory todoItem;
    todoItem.value = _value;
    todoItem.active = false;

    todoItems.push(todoItem);
    return (todoItem.value, todoItem.active);
  }

  function getTodoItems() external override view returns (bytes32[] memory, bool[] memory){
    uint len = todoItems.length;

    bytes32[] memory values = new bytes32[](len);
    bool[] memory actives = new bool[](len);

    for (uint i = 0; i < len; i++){
      values[i] = todoItems[i].value;
      actives[i] = todoItems[i].active;
    }
    return (values, actives);
  }

  function delTodoItem(uint index) external override returns (bool){
    if(index >= todoItems.length) return false;

    for (uint i = index ; index < todoItems.length - 1; i++) {
      todoItems[i] = todoItems[i+1];
    }
    todoItems.pop();
    return true;
  }
}

