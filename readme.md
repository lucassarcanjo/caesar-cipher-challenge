# Caesar Cipher Challenge

That is my solution to [Codenation Challenge](https://www.codenation.dev/) using NodeJS.

## Caesar Cipher

Caesar cipher is a method in wich letter in the plaintext is replaced by a letter some fixed number of positions down te alphabet. Also, it is one of the simplest and most widely known encryption techniques. 

## Basic Explanation

The program uses a http request for Codenation API to retrieve the text that will be converted and the shifting number. After that, the program decrypt the phrase following the rules:

- The messages will be converted to lowercase for both encryption and decryption;
- The numbers and periods will be kept;

Also, a sha1 digest is created with the deciphered phrase.

The final structure to submiss at Codenation API is:

```json
{
    "numero_casas": 10,
    "token": "my_token",
    "cifrado": "",
    "decifrado": "",
    "resumo_criptografico": ""
}
```

## Execution

To run the code on your machine: 

1. create a `.env` file with an `API_TOKEN` field;
2. run `yarn install` or `npm install` to install dependencies;
3. run `yarn start` or `npm start` to run the program.
