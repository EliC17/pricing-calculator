import "dotenv/config";

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.currencyapi.com/v3/latest?&currencies=EUR%2CAUD%2CCAD&";

//const tempy = {};

export async function testApi() {
    const response = await fetch(apiUrl + "apikey=" + apiKey);
    const tempObj = {};
    if(response.status == 404){
    console.log("Error");
    }else{
        var data = await response.json();
        tempObj.cad = data.data.CAD.value;
        tempObj.eur = data.data.EUR.value;
        tempObj.aud = data.data.AUD.value;
        return tempObj;
    }
}