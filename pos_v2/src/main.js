function splitTag(inputs) {
    var result = [];
    var cartItems = [];
    inputs.forEach(function (item) {
        var count = 0;
        result = item.split("-");
        if (result.length != 1) {
            count = parseInt(result[1]);
        }

        cartItems.push({
            barcode: result[0],
            count: count
        });
    })
    return cartItems;
}

function mergeCartItemCount(cartItems) {
    var result = [];
    cartItems.forEach(function (cartItem) {
        var existItem = result.find(function (item) {
            return item.barcode === cartItem.barcode;
        })

        if (!existItem) {
            existItem = Object.assign({}, cartItem);
            result.push(existItem);
            if (existItem.count != 0) {
                return;
            }
        }
        existItem.count++;

    })

    return result;
}

function addCartItemInfo(mergecartItems) {
    var result = [];
    var allItems = loadAllItems();
    allItems.forEach(function (item) {
        var existItem = mergecartItems.find(function (mergecartItem) {
            return item.barcode === mergecartItem.barcode;
        })

        if (existItem) {
            existItem = Object.assign({
                name: item.name,
                unit: item.unit,
                price: item.price
            }, existItem)
            result.push(existItem);
        }
    })


    console.debug(result);
}

function printInventory(inputs) {
    var cartItems = splitTag(inputs);
    var mergecartItems = mergeCartItemCount(cartItems);
    var mergecartItemsWithAllInfo = addCartItemInfo(mergecartItems)
}