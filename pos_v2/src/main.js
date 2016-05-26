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
    });
    return cartItems;
}

function mergeCartItemCount(cartItems) {
    var result = [];
    cartItems.forEach(function (cartItem) {
        var existItem = result.find(function (item) {
            return item.barcode === cartItem.barcode;
        });

        if (!existItem) {
            existItem = Object.assign({}, cartItem);
            result.push(existItem);
            if (existItem.count != 0) {
                return;
            }
        }
        existItem.count++;

    });

    return result;
}

function addCartItemInfo(mergecartItems) {
    var result = [];
    var allItems = loadAllItems();
    allItems.forEach(function (item) {
        var existItem = mergecartItems.find(function (mergecartItem) {
            return item.barcode === mergecartItem.barcode;
        });

        if (existItem) {
            existItem = Object.assign({
                name: item.name,
                unit: item.unit,
                price: item.price
            }, existItem);
            result.push(existItem);
        }
    });
    return result;
}

function transferPromotion(mergecartItemsWithAllInfo) {
    var result = [];
    var promotionItems = [];
    promotionItems = loadPromotions()[0].barcodes;
    mergecartItemsWithAllInfo.forEach(function (item) {
        var promotionItem;
        var freeCount = 0;
        if (promotionItems.indexOf(item.barcode) > 0) {
            freeCount = Math.floor(item.count / 3);
        }
        promotionItem = Object.assign({
            promotionCount: freeCount,
            promotionPrice: freeCount * item.price
        }, item);
        result.push(promotionItem);
    });
    return result;
}

function calculateSubPrice(items) {
    return items.map(function (item) {
        return Object.assign({
            subTotalPrice: item.price * (item.count - item.promotionCount)
        }, item);
    });
}

function calculateTotalPrice(items) {
    return items.reduce(function (a, b) {
        return {
            subTotalPrice: a.subTotalPrice + b.subTotalPrice
        };
    });
}

function calculatePromotionTotalPrice(items) {
    return items.reduce(function (a, b) {
        return {
            promotionPrice: a.promotionPrice + b.promotionPrice
        };
    });
}

function dateDigitToString(num) {
    return num < 10 ? '0' + num : num;
}

function getDateString() {
    var currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds());
    return year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
}

function print(cartItems, freeItems, promotionTotalPrice, totalPrice) {
    var result = '***<没钱赚商店>购物清单***\n' +
        '打印时间：' + getDateString() + '\n' +
        '----------------------\n';
    cartItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.count}${element.unit}，单价：${element.price.toFixed(2)}(元)，小计：${element.subTotalPrice.toFixed(2)}(元)\n`;
    });
    result += '----------------------\n';
    result += '挥泪赠送商品：\n';
    freeItems.forEach(function (element) {
        result += `名称：${element.name}，数量：${element.promotionCount}${element.unit}\n`;
    });
    result += '----------------------\n';
    result += `总计：${totalPrice.subTotalPrice.toFixed(2)}(元)\n`;
    result += `节省：${promotionTotalPrice.promotionPrice.toFixed(2)}(元)\n`;
    result += '**********************';
    console.log(result);
}

function getPromotionItems(items) {
    return items.filter(function (item) {
        return item.promotionCount != 0;
    });
}

function printInventory(inputs) {
    var cartItems = splitTag(inputs);
    var mergeCartItems = mergeCartItemCount(cartItems);
    var mergeCartItemsWithAllInfo = addCartItemInfo(mergeCartItems);
    var promotionItems = transferPromotion(mergeCartItemsWithAllInfo);
    var promotionItemsWithSubPrice = calculateSubPrice(promotionItems);
    var totalPrice = calculateTotalPrice(promotionItemsWithSubPrice);
    var promotionTotalPrice = calculatePromotionTotalPrice(promotionItemsWithSubPrice);
    var freeItems = getPromotionItems(promotionItemsWithSubPrice);
    print(promotionItemsWithSubPrice, freeItems, promotionTotalPrice, totalPrice);
}