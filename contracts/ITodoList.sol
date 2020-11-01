//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

interface ITodoList {

  function addTodoItem(bytes32 value) external returns (bytes32, bool);

  function getTodoItems() external view returns(bytes32[] memory, bool[] memory);

  function delTodoItem(uint index) external returns (bool);
}
