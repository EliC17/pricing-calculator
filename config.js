import "dotenv/config";

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.currencyapi.com/v3/latest?&currencies=EUR%2CAUD%2CCAD&";

export const conversions = {};

async function testApi() {
    const response = await fetch(apiUrl + "apikey=" + apiKey);

    if(response.status == 404){
    console.log("Error");
    }else{
        var data = await response.json();
        conversions.cad = data.data.CAD.value;
        conversions.eur = data.data.EUR.value;
        conversions.aud = data.data.AUD.value
        console.table(conversions);
        if(code == "CAD"){
            let value = data.data.CAD.value;
            console.log(data.data.CAD.value);
            return value;
        }
        if(code == "EUR"){
            let value = data.data.EUR.value;
            console.log(data.data.EUR.value);
            return value;
        }
        if(code == "AUD"){
            let value = data.data.AUD.value;
            console.log(data.data.AUD.value);
            return value;
        }
    }
}

testApi();