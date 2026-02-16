// Axios serve pra conversar com o servidor (backend / API), e faz GET, POST, PUT, DELETE sem você precisar escrever tudo na mão, como fetch.
import axios, { type AxiosRequestConfig } from 'axios';

/*
   Para usar variável de ambiente com o vite, usasse no baseURL import.meta.env.
   create transforma a requisição num "telefone fixo" do seu backend, em vez de ficar configurando a requisição toda hora, você configura UMA VEZ e reutiliza.
   O baseURL precisa ser string, o import.meta faz  o vite abrir o arquivo .env e buscar pelo endereço da config da url passada e substituir no código antes do navegador ler.
*/
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

/*

    AxiosRequestConfig é o objeto que controla o comportamento da requisição HTTP.

    | Campo           | Pra que serve                  |
    | --------------- | ------------------------------ |
    | url             | endereço da rota               |
    | method          | GET, POST, PUT…                |
    | baseURL         | servidor padrão                |
    | headers         | autorização, content-type      |
    | params          | query string (?page=1)         |
    | data            | corpo da requisição (POST/PUT) |
    | timeout         | tempo limite                   |
    | withCredentials | enviar cookies                 |
    | responseType    | json, blob, text               |
    | signal          | cancelar requisição            |

*/

/*
    data é o conteúdo enviado ao backend dentro do corpo da requisição HTTP. params vai na URL

    | Método | Usa `data`?         |
    | ------ | ------------------- |
    | GET    |   não               |
    | DELETE |   (normalmente não) |
    | POST   |   sim               |
    | PUT    |   sim               |
    | PATCH  |   sim               |

*/

// A função fetcher é um atalho que faz a requisição e devolve somente o corpo da resposta
export const fetcher = (url: string, options: AxiosRequestConfig = {}) => {
    return api.get(url, options).then((res) => res.data);
}