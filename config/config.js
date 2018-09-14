const bgColor = '#133c74';
const bgColorSecundario = '#15427F';
const bgColorTerciario = '#1a55a7';

// const BASE_URL = "http://6d8f70f8.ngrok.io/Api/"; // Desarrollo
const BASE_URL = "http://201.231.98.97/Api/"; // Produccion

const NormalizarNumero = (num) => {
    num = num.substring(0, 1) == '.' ? '0' + num : num;

    return parseFloat(num).toFixed(2);
} ;

const ConsultarUrlConsulta = (urlConsulta, callback) => {
    fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                .then((response) => response.json())
                .then((responseJson) => {
                    callback(fetch(responseJson[0].url + urlConsulta));
                })
}

const Consultar = async (urlConsulta, callback) => {
    callback(fetch(BASE_URL + urlConsulta));
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