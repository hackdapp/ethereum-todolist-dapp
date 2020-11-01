const TodoListContract = artifacts.require('./TodoList.sol')
const fs = require('fs')

module.exports = function (deployer){
  deployer.deploy(TodoListContract, { gas: 5000000}).then((result) => {
    fs.writeFileSync('src/deployed_contract.json', JSON.stringify({
      transactionHash: result.transactionHash,
      address: result.address
    }, null, 4))
  }).catch((err) => {
    console.log(err)
  });
}

