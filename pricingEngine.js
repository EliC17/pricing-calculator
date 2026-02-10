const data = require("./products.json");
const orderList = require("./orders.json");
const config = require("./config.js");

function getProductById(id){
    const item = data.products.find(p => p.id === id)
    if (item) {
        //console.log(`Found: ${item.name}`);
        return item;
    } else {
        console.log('Item not found');
    }
}

function getProductByName(name){
    const item = data.products.find(p => p.name === name)
    if (item) {
        console.log(`Found: ${item.name}`);
        return item;
    } else {
        console.log('Item not found');
    }
}

function calculateLineItem(){
    const orderDetails = [];
    orderList.order.forEach(p => {
        let orderOne = getProductById(p.productId);
        let total = (p.quantity) * (orderOne.basePrice);
        if(orderList.customerType == "wholesale"){
            total = total - (total * 0.10); //10% for wholesale
        }
        if(p.quantity > 10){
            total = total - (total * 0.10); //10% for volume
        }
        if(orderList.isFirstTime){
            total = total - (total * 0.10); //10% for first time customers
        }
        const ordersTemp = [];
        ordersTemp.push(p.productId, p.quantity, total)
        orderDetails.push(ordersTemp);
    })
    console.log("Order Details: ");
    console.table(orderDetails);
    return orderDetails;
}

function applyPromoCode(processedOrders){
    let code = orderList.promoCode;
    for(const order of processedOrders){
        if(code == "SAVE10"){
            let newTotal = order[2] - (order[2] * 0.10);
            order[2] = newTotal;
        }
    }
    console.log("Discounted Orders: ");
    console.table(processedOrders);
    return processedOrders;
}

async function convertCurrency(order) {
    const tempCurrency = await config.testApi();
    let currency = orderList.currency;
    for(const values of order){
        if(currency == "CAD"){
            let newTotal = values[2] / tempCurrency["CAD"];
            values[2] = newTotal;
        }
        if(currency == "Eur"){
            let newTotal = values[2] / tempCurrency["EUR"];
            values[2] = newTotal;
        }
        if(currency == "AUD"){
            let newTotal = values[2] / tempCurrency["AUD"];
            values[2] = newTotal;
        }
    }
    console.log("Converted Currency to USD: ")
    console.table(order);
}


let itemOrder = calculateLineItem();
let discountedOrder = applyPromoCode(itemOrder);
convertCurrency(discountedOrder);

