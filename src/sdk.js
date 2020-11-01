import contract from 'truffle-contract';
import Web3 from "web3";
import _ from 'lodash';
import TodoListContractABI from './contracts/TodoList';
import deployContract from './deployed_contract'

const ethEnabled = () => {
  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
    return true;
  }
  return false;
}

let web3 ;
if (!ethEnabled()) {
  alert("Please install MetaMask to use this dApp!");
}else{
  web3 = window.web3;
}

export const getTodoItems = async () => {
  const TodoListContract = await selectContractInstance(TodoListContractABI);
  const result = await TodoListContract.getTodoItems();
  return mapResponseToJson(result, ['value', 'active'], 'arrayOfObject')
}

export const addTodoItem = async (item) => {
  item = web3.utils.fromAscii(item).padEnd(66, '0');
  const TodoListContract = await selectContractInstance(TodoListContractABI);

  const fromAddr = await getDefaultAccount();
  return await TodoListContract.addTodoItem(item, { from: fromAddr});
}

export const delTodoItem = async (index) => {
  const TodoListContract = await selectContractInstance(TodoListContractABI);

  console.log(index)
  const fromAddr = await getDefaultAccount();
  console.log(fromAddr)
  return await TodoListContract.delTodoItem(index, { from: fromAddr })
}

const getDefaultAccount = async ()=>{
  let fromAddr = ""
  await web3.eth.getAccounts((err, res)=>{
    fromAddr = res[0]
  });
  return fromAddr;
}

export const selectContractInstance = async (contractBuild) => {
  return new Promise(res => {
    const myContract = contract(contractBuild);
    myContract.setProvider(web3.currentProvider);
    myContract.at(deployContract.address).then(instance => res(instance));
  })
}

export const mapResponseToJson = async (contractResponse, parameters, type) => {
  switch (type) {
    case 'arrayOfObject': {
      const result = [];
      _.forEach(contractResponse, (paramValues, paramIndex) => {
        const paramName = parameters[paramIndex];
        paramValues.forEach((paramValue, itemIndex) => {
          const item = _.merge({}, _.get(result, [itemIndex], {}));
          if (typeof paramValue === 'string') {
            paramValue = web3.utils.toAscii(paramValue).trim();
          }
          item[paramName] = paramValue;
          result[itemIndex] = item;
        })
      });

      return result;
    }
    default:
      return contractResponse;
  }
}

