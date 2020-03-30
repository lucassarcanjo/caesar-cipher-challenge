const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');
require('dotenv').config();


async function getCodenationMessage(my_token) {
    const req_url = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data';
    

    const response = await axios.get(req_url, {
        params: {
            token: my_token
        }
    });

    console.log(response.data);
    return response.data;
}

function caesarShift (str, count) {

    // wrap the amount
    if (count < 0)
        return caesarShift(str, count + 26);

    let output = '';

    // percorrendo cada caractere
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        let char = str[i];

        if (charCode >= 97 && charCode <= 122)          // se o caractere da posição [i] é uma letra minúscula
            char = String.fromCharCode(((charCode - 97 + count) % 26) + 97);
        
        output += char;
    }

    return output
}

async function submitCodenationTest(data_obj, my_token) {
    function getFormData(object) {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
    
        return formData;
    }

    const api_url = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution';
    const form = getFormData(data_obj);

    return await axios.post(api_url, form, {
        headers: form.getHeaders(),
        params: {
            token: my_token
        }
    });
}


// ----------------------------------------------------------------------------------------------------
console.log('Desafio Codenation - Criptografia de Julio Cesar\n\n');

const my_token = process.env.API_TOKEN;

// Obtendo mensagem do server Codenation utilizando meu token pessoal
// const res_data = getCodenationMessage(my_token);


// decodificação da mensagem
const data = {
    cifrado: 'kbwb jt up kbwbtdsjqu xibu dbs jt up dbsqfu. disjt ifjmnboo',
    decifrado: '',
    numero_casas: 1,
    resumo_criptografico: '',
    token: process.env.API_TOKEN
};

console.log(`Dado de entrada (rotação de ${data.numero_casas}):\n${data.cifrado} `)

data.decifrado = caesarShift(data.cifrado, -data.numero_casas);
console.log(`Dado decifrado: ${data.decifrado}`);


// Resumo criptografico com SHA1
data.resumo_criptografico = crypto.createHash('sha1').update(data.decifrado).digest('hex');
console.log(`Dado encriptado com SHA1: ${data.resumo_criptografico}`);


// Salvando o arquivo answer.json
const jsonData = JSON.stringify(data, null, 2);

fs.writeFile('answer.json', jsonData, (err) => {
    if(err) {
        console.log(err);
    }
});


// Submissão do arquivo atualizado na api da Codenation - Nao funcional
// const score = submitCodenationTest(data, my_token);
console.log(score);