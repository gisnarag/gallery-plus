

/* 
    T é o tipo que precisa ser uma função. Ou seja: T não pode ser número, string, objeto.
    args é um nome de variável que defini para representar todos os argumentos que a função recebe de qualquer quantidade, e any[] significa que retorna alguma coisa

    O wait representa o tempo que a função espera para executar. Ou seja, a função só roda depois que o wait é ultrapassado.

*/

/*
o que significa isso?
(...args: any[]) => any


É o formato de uma função:

parte	significado
...args	qualquer quantidade de argumentos
any[]	de qualquer tipo
=> any	retorna qualquer coisa

Então:

T deve ser obrigatoriamente uma função

Essa função recebe 2 coisas:

debounce( FUNÇÃO, TEMPO )

let timeout: ReturnType<typeof setTimeout> | null = null

Crie uma variável que guarda o temporizador atual (independente do ambiente: node/navegador) ou nada caso não exista timer ativo.

let timeout	guarda o timer atual
typeof setTimeout -> pegue o tipo  da função setTimeout
ReturnType	descobre o tipo automaticamente -> necessário porque o tipo retornado por setTimeout MUDA dependendo do ambiente

Navegador ->	number
Node.js	-> Timeout object

| null	pode não existir timer ainda
= null	começa sem timer

No return

O debounce não executa a função na hora
Ele cria uma nova função controladora

debounce(func)  →  devolve outra função

Essa função é a que você realmente chama no React:

debouncedSetValue(value)

...args: Parameters<T>

essa nova função aceita exatamente os mesmos parâmetros da função original
*/


export function debounce<T extends (...args: any[]) => any>(func: T, wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return function (...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func(...args)
        }

        if (timeout !== null) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(later, wait)
    };
}
