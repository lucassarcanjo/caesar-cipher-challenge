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

async function submitCodenationTest(file, my_token) {
    function getFormData(file) {
        const formData = new FormData();
        const answer = fs.createReadStream(file);
        formData.append('answer', answer);
    
        return formData;
    }

    const api_url = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution';
    const form = getFormData(file);

    try {
        return await axios.post(api_url, form, {
            headers: form.getHeaders(),
            params: {
                token: my_token
            }
        });
    } catch (error) {
        console.log(`Erro ao tentar executar a submissao de dados na API Codenation: ${error}`);
    }
}

async function main() {
    console.log('Desafio Codenation - Criptografia de Julio Cesar\n\n');

    const my_token = process.env.API_TOKEN;
    
    // Obtendo mensagem do server Codenation utilizando meu token pessoal
    const data = await getCodenationMessage(my_token);
    console.log(`Dado de entrada (rotação de ${data.numero_casas}):\n${data.cifrado} `)
    
    data.decifrado = caesarShift(data.cifrado, -data.numero_casas);
    console.log(`Dado decifrado: ${data.decifrado}`);
    
    
    // Resumo criptografico com SHA1
    data.resumo_criptografico = crypto.createHash('sha1').update(data.decifrado).digest('hex');
    console.log(`Dado encriptado com SHA1: ${data.resumo_criptografico}`);
    
    
    // Salvando o arquivo answer.json
    fs.writeFileSync('answer.json', JSON.stringify(data, null, 2),
        (err) => {
            if(err) 
                console.log(err);
    });
    
    
    // Submissão do arquivo atualizado na api da Codenation
    const score = await submitCodenationTest('./answer.json', my_token);
    console.log(score.data);
}

// ----------------------------------------------------------------------------------------------------
main();