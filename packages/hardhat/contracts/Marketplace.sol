// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


interface IERC20Token {
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function totalSupply() external view  returns (uint256);
    function balanceOf(address) external view  returns (uint256);
    function allowance(address, address) external view  returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract Marketplace {
    // string public product;
    uint internal productsLength;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Product {
        address payable owner;
        // a payable modifier that allows your contract to send tokens to this address. This variable will be named owner because it’s the address of the user who submitted the product.
        string name;
        string image;
        string description;
        string location;
        uint256 price;
        uint256 sold;
        uint256 quantity;
        bool available;
    }

    mapping (uint => Product) internal products;

    function writeProduct( 
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint _price,
        uint256 _quantity
        ) public {
            uint _sold = 0;
            require(_quantity > 0, "Quantity Must be greater than zero");
        products[productsLength] = Product(
            payable(msg.sender),
            // msg.sender returns the address of the entity that is making the call, it is also payable. This is what you are going to save as the owners’ address.
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold,
            _quantity,
            true
        );
        productsLength++;
    }

    function readProduct(uint _index) public view returns(
        address payable,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        bool
    ) {
        Product storage product = products[_index];
        return (
            product.owner,
            product.name,
            product.image,
            product.description,
            product.location,
            product.price,
            product.sold,
            product.quantity,
            product.available
        );

    }

    // to buy a product
    function buyproduct(uint _index) public payable {
        require(products[_index].quantity > 0, "there is no product left");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                products[_index].owner,
                products[_index].price
            ),
            "Transfer Failed"
        );
        products[_index].sold++;
        products[_index].quantity--;
        if (products[_index].quantity == 0) {
            products[_index].available = false;
        }
    }

    function updateProduct(uint256 _index, uint256 _quantity, uint256 _price) public {
        products[_index].quantity = _quantity;
        products[_index].price = _price;
    }

    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }
    

}
