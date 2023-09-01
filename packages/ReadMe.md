

### Contracts
To check the contrat check the hardhat folder

***
To deploy on alfajories 
***
```
yarn install
```
After installment 

```
yarn hardhat run --network alfajores scripts/deploy.js
```
To deploy on alfajories. Once you deploy your contract it will automatically store your deploy address and abi in abi folder in your react-app frontend folder.

## I improve this dapp 
***
Adding the Number of product availablee for sale in units
Checking if the product is available with the Number of uints. If the unit of the product is zero you can have access to the Buy function
The owner of the product can not buy their product. They can only update their products.
***