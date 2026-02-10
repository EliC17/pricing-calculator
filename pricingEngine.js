const data = require("./products.json");
const orderList = require("./orders.json");
const config = require("./config.js");

function getProductById(id){
    const item = data.products.find(p => p.id === id)
    if (item) {
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

function calculateTax(order){
    let region = orderList.region;
    for(const values of order){
        if(region == "North America"){
            let newTotal = values[2] + (values[2] * 0.30);
            values[2] = newTotal;
        }
        if(region == "Australia"){
            let newTotal = values[2] + (values[2] * 0.10);
            values[2] = newTotal;
        }
        if(region == "France"){
            let newTotal = values[2] + (values[2] * 0.200);
            values[2] = newTotal;
        }
    }
    console.log("Apply Tax: ");
    console.table(order);
    return order;
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
    return order;
}

async function main(){
    let itemOrder = calculateLineItem();
    let taxedOrder = calculateTax(itemOrder);
    let discountedOrder = applyPromoCode(taxedOrder);
    const finalOrder = await convertCurrency(discountedOrder);
    let total = 0;
    for(const it of finalOrder){
        total += it[2];
    }
    const totalRounded = total.toFixed(2);
    console.log("Total Amount for this Order:", totalRounded);
}

main();