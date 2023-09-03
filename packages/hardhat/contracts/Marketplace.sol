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
    uint internal productsLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    /**
     * @dev A struct representing a product listed in the marketplace.
     * @notice Each product has various attributes, including its owner, name, image, description, location, price, quantity, and availability.
     * @notice - `owner`: The address of the user who submitted the product. It is payable, allowing tokens to be sent to this address.
     * @notice - `name`: The name or title of the product.
     * @notice - `image`: The URL or reference to an image of the product.
     * @notice - `description`: A detailed description of the product.
     * @notice - `location`: The origin or location of the product.
     * @notice - `price`: The price of the product in the specified ERC20 token.
     * @notice - `sold`: The number of units of the product that have been sold.
     * @notice - `quantity`: The total quantity of the product available for sale.
     * @notice - `available`: A boolean indicating whether the product is currently available for purchase.
     */
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

    /**
    * @dev A mapping that associates product indices with their respective Product structs.
    * @notice Each product index corresponds to a specific product in the marketplace.
    * @notice The Product struct stores details about each product, such as owner, name, price, quantity, and availability.
    * @notice Use the product index to look up product information in this mapping.
    */
    mapping (uint256 => Product) internal products;

    /**
     * @dev Emitted when a new product is added to the marketplace.
     * @param owner The address of the product owner.
     * @param name The name of the added product.
     * @param price The price of the added product in the specified ERC20 token.
     * @param quantity The initial quantity of the added product available for sale.
     */
    event ProductAdded(
        address indexed owner,
        string name,
        uint256 price,
        uint256 quantity
    );

    /**
     * @dev Emitted when a product's details, such as quantity and price, are updated.
     * @param index The index of the updated product.
     * @param newQuantity The new quantity of the product.
     * @param newPrice The new price of the product in the specified ERC20 token.
     */
    event ProductUpdated(
        uint indexed index,
        uint256 newQuantity,
        uint256 newPrice
    );


    /**
     * @dev Emitted when a product is purchased from the marketplace.
     * @param index The index of the purchased product.
     * @param buyer The address of the buyer who made the purchase.
     * @param quantity The quantity of the purchased product.
     * @param totalPrice The total price paid by the buyer for the purchase.
     */

    event ProductPurchased(
        uint indexed index,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );

    /**
     * @dev Add a new product to the marketplace.
     * @param _name The name of the product.
     * @param _image The image URL of the product.
     * @param _description The description of the product.
     * @param _location The location or origin of the product.
     * @param _price The price of the product in the specified ERC20 token.
     * @param _quantity The initial quantity of the product available for sale.
     */
    function writeProduct( 
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint256 _price,
        uint256 _quantity
        ) public {
            require(bytes(_name).length > 0, "Name must not be empty"); 
    require(bytes(_image).length > 0, "Image must not be empty"); 
    require(bytes(_description).length > 0, "Description must not be empty"); 
    require(bytes(_location).length > 0, "Location must not be empty"); 
    require(_price > 0, "Price must be greater than zero"); 
    require(_quantity > 0, "Quantity must be greater than zero");
            // require(_quantity > 0, "Quantity Must be greater than zero");
        products[productsLength] = Product(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            0, // Initialize sold to 0
            _quantity,
            true
        );
        productsLength++;
        emit ProductAdded(msg.sender, _name, _price, _quantity);
    }

    /**
     * @dev Read product details by index.
     * @param _index The index of the product to read.
     * @return A tuple containing the product details.
     */
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
        require(_index < productsLength, "Product index out of bounds");
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
  
    /**
     * @dev Buy a product from the marketplace using an ERC20 token.
     * @param _index The index of the product to purchase.
     */
    function buyProduct(uint _index) public payable{
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
        emit ProductPurchased(_index, msg.sender, 1, products[_index].price);
    }

    /**
     * @dev Update product details, including quantity and price.
     * @param _index The index of the product to update.
     * @param _quantity The new quantity of the product.
     * @param _price The new price of the product in the specified ERC20 token.
     */
    function updateProduct(uint256 _index, uint256 _quantity, uint256 _price) public {
        require(_index < productsLength, "Product index out of bounds"); 
        require(_quantity > 0, "Quantity must be greater than zero"); 
        products[_index].quantity = _quantity;
        products[_index].price = _price;
        emit ProductUpdated(_index, _quantity, _price);
    }

    /**
     * @dev Get the total number of products in the marketplace.
     * @return The length of the products array.
     */
    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }
    

}
