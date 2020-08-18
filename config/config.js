const bgColor = '#133c74';
const bgColorSecundario = '#15427F';
const bgColorTerciario = '#1a55a7';

//const BA SE_URL = "https://08bb486d.ngrok.io/Api/"; // Desarrollo
const BASE_URL = "http://201.231.98.97/Api/"; // Produccion
const BASE_URLII = "http://24.232.10.16/Api/"; // Produccion
const BASE_URLIII = "http://181.28.207.136/Api/"; // Produccion
let BASE_FINAL = "";

const NormalizarNumero = (num) => {
    num = num.substring(0, 1) == '.' ? '0' + num : num;
    return parseFloat(num).toFixed(2);
} ;

const ApiUrlBase = async () => {
    if (BASE_FINAL === ""){
        BASE_FINAL = await fetch(`${BASE_URL}Muestras`).then(resp => BASE_URL).catch(err => BASE_URLII);
        if (BASE_FINAL == BASE_URLII) BASE_FINAL = await fetch(`${BASE_FINAL}Muestras`).then(resp => BASE_FINAL).catch(err => BASE_URLIII);
    }
    return BASE_FINAL;
};

const ConsultarUrlConsulta = (urlConsulta, callback) => {
    fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                .then((response) => response.json())
                .then((responseJson) => {
                    callback(fetch(responseJson[0].url + urlConsulta));
                })
}

const Consultar = async (urlConsulta, callback) => {
    let _base = await ApiUrlBase();
    callback(fetch(_base + urlConsulta));
}

export default {
    bgColor,
    bgColorSecundario,
    bgColorTerciario,
    ConsultarUrlConsulta,
    Consultar,
    NormalizarNumero,
    BASE_URL
};