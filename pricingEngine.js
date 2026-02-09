const data = require("./products.json");
const orderList = require("./orders.json");

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
    //console.table(orderDetails);
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
    console.table(processedOrders);
}

applyPromoCode(calculateLineItem());