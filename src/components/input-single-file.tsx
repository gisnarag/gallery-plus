import React from 'react';
import { type VariantProps, tv } from 'tailwind-variants';
import Icon from './icon';
import Text from "./text";
import UploadFileIcon from "../assets/icons/upload-file.svg?react";
import FileImageIcon from "../assets/icons/image.svg?react";
import { textVariants } from "./text";
import { useWatch } from 'react-hook-form';

export const inputSingleFileVariants = tv({
    base: `
    flex flex-col items-center justify-center w-full
    border border-solid border-border-primary
    group-hover:border-border-active
    rounded-lg gap-1 transition
    `,
    variants: {
        size: {
            md: "px-5 py-6"
        }
    },
    defaultVariants: {
        size: "md"
    }
});

export const InputSingleFileIconVariants = tv({
    base: "fill-placeholder",
    variants: {
        size: {
            md: "w-8 h-8"
        }
    },
    defaultVariants: {
        size: "md"
    }
});

interface InputSingleFileProps extends VariantProps<typeof inputSingleFileVariants>, Omit<React.ComponentProps<"input">, "size"> {
    form: any;
    allowedExtensios: string[];
    maxFileSizeInMB: number;
    replaceBy: React.ReactNode;
    error?: React.ReactNode;
}

/* truncate é uma classe do Tailwind que corta o texto quando ele é grande demais pra caber no espaço. O texto não quebra linha, o que sobra some e aparece ... no final

React-hook-form será usado para manipular a mudança de estado: quando não houver imagem, exibir uma div para adicionar e quando houver exibir outra div com conteúdo. 

useWatch é um hook do react-hook-form que observa valores do formulário e re-renderiza o componente quando esses valores mudam
o form (ou control) precisa ser passado nas props do componente. Se os campos observados mudarem, o componente re-renderiza

control → conecta o componente ao form. useWatch → escuta mudanças
só re-renderiza para os campos que você escolheu observar

form é o objeto retornado pelo useForm(), que é um hook do react-hook-form.const form = useForm(). Ele contém: control, register, handleSubmit, etc. 
Tudo isso vem do react-hook-form: control → usado por useWatch, Controller, etc.
register → conecta inputs ao form
handleSubmit → lida com o submit
setValue → seta valores manualmente
getValues → lê valores
formState → erros, dirty, touched…

Quando você faz: useWatch, hook cria um estado interno, escuta os eventos dos inputs (change), quando atualiza o valor do campo, o componente re-renderiza

Usuário escolhe arquivo
        ↓
<input type="file" name="file" />
        ↓
register (react-hook-form)
        ↓
estado interno do form
        ↓
useWatch 
        ↓
formValues["file"][0] estado interno atualizado

Campos type="file" retornam uma lista de arquivos (FileList).
Mesmo quando é só um arquivo. Por isso -> formValues["file"][0]
Pegue o primeiro arquivo do campo do formulário cujo nome é name.

array de dependências do useMemo -> Só recalcule isso se os valores do formulário mudarem OU o nome do campo mudar.
Se nada disso mudar → reutiliza o valor anterior.
*/

/* FLUXO

No app, uso o register no componente passando form da prop com o form de uma variável que nomeei assim que recebe um useForm()
register conecta o input ao estado do react-hook-form

O register cria o name no input recebida através das props. Escuta mudanças (onChange), registra o ref e guarda o valor no estado interno do form

<InputSingleFile form={form} {...form.register("file")} />

O register("file") retorna um objeto:

{
  name: "file",
  onChange: fn,
  onBlur: fn,
  ref: fn
}

Esse objeto é espalhado (...) nas props do componente. Dentro do InputSingleFile({ form, ...props }), o ...props contém tudo que veio do register, incluindo: props.name === "file"

E <input type="file" {...props} /> é o mesmo que escrever:
<input
  type="file"
  name="file"
  onChange={registerOnChange}
  ref={registerRef}
/>

Ou seja:

o name chega no input
o react-hook-form passa a controlar esse campo
o valor entra no estado do form

Usuário escolhe arquivo
        ↓
<input type="file" />
        ↓
register("file") escuta o change
        ↓
react-hook-form atualiza estado interno
        ↓
useWatch percebe a mudança
        ↓
InputSingleFile re-renderiza
        ↓
formValues["file"][0] agora existe


register("file")
   ↓
{name: "file", onChange, ref}
   ↓
spread {...props}
   ↓
props.name === "file"
   ↓
useWatch → formValues = { file: [File] } formValues é um OBJETO com os valores do formulário. formValues = {
  file: [File],
  name: "João",
  email: "joao@email.com"
}


O name="file" do input NUNCA MUDA

<input type="file" name="file" />

"file" é o nome do CAMPO do formulário, você escolheu esse nome quando fez:
register("file")

Esse name: é fixo, é a chave do objeto formValues, não tem nada a ver com o nome do arquivo

O que MUDA então? o VALOR guardado nessa chave

formValues = {
  file: [File]
}

file → chave (campo)

[File] → valor (conteúdo atual do campo)

Se o usuário trocar o arquivo: a chave continua file, o File dentro muda

3Agora entra o File (objeto do browser)

Quando o usuário escolhe um arquivo, o browser cria um objeto assim:

File {
  name: "foto.png",
  size: 123456,
  type: "image/png",
  lastModified: 171000000
}

Onde nasce o formFile.name

a) useWatch retorna o estado do form
formValues = {
  file: [File]
}

b) Você acessa o campo pelo nome do input
formValues[name]
Como:

name === "file"
fica:

formValues["file"] // → [File]

c) Você pega o primeiro arquivo
formValues["file"][0]
Isso é:

File

d) Você guarda isso em formFile
const formFile = File;

e) Agora sim: você acessa propriedades do File
formFile.name

Aqui você está lendo:

qual é o nome do arquivo selecionado?

input name="file" -> nome do campo do formulário
File.name -> nome real do arquivo no computador

FLUXO ->

INPUT
----------------
name = "file"   ← nome do CAMPO (fixo)

FORM STATE
----------------
formValues = {
  file: [ File ]
}

FILE (browser)
----------------
File {
  name: "meu-arquivo.png" ← nome DO ARQUIVO
}

*/

/*
onClick={() => form.setValue(name, undefined)}

3
Parâmetros do setValue
setValue(campo, valor, opções?)

1º parâmetro → campo

name -> é uma string, vem do input (props.name) -> "file", indica QUAL campo do form será alterado

2º parâmetro → valor

undefined
remove o valor atual do campo. Para type="file" === undefined significa: não existe mais arquivo selecionado ou seja não existe mais formFile, o campo volta ao “estado vazio” 

*/

// Lidar com tamanho e extensão de arquivo
// split quebra uma string em partes, usando o ponto como separador. Ex: ["meu-arquivo", "FOTO", "PNG"] -> pop(): pega o ÚLTIMO item do array. Resultado PNG

export default function InputSingleFile({ form, size, error, allowedExtensios, maxFileSizeInMB, replaceBy, ...props }: InputSingleFileProps) {
    const formValues = useWatch({ control: form.control });
    const name = props.name || "";
    const formFile: File = React.useMemo(
        () => formValues[name]?.[0], [formValues, name]
    );

    const { fileExtension, fileSize } = React.useMemo(() => ({
        fileExtension: formFile?.name?.split('.')?.pop()?.toLowerCase() || "",
        fileSize: formFile?.size || 0
    }), [formFile])

    function isValidExtension() {
        return allowedExtensios.includes(fileExtension)
    }

    function isValidSize() {
        return fileSize <= maxFileSizeInMB * 1024 * 1024
    }

    function isValidFile() {
        return isValidExtension() && isValidSize();
    }

    return (
        <div>
            {!formFile || !isValidFile() ?
                (
                    <>
                        <div className="w-full relative group cursor-pointer">
                            <input type="file" className={`
                absolute top-0 right-0 w-full h-full
                opacity-0 cursor-pointer
                `} {...props} />

                            <div className={inputSingleFileVariants({ size })}>
                                <Icon svg={UploadFileIcon} className={InputSingleFileIconVariants({ size })} />
                                <Text variant="label-medium" className="text-placeholder text-center">
                                    Arraste o arquivo aqui
                                    <br />
                                    ou clique para selecionar
                                </Text>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                            {formFile && !isValidExtension() &&
                                <Text variant="label-small" className="text-accent-red">
                                    Tipo de arquivo inválido
                                </Text>}
                            {formFile && !isValidSize() &&
                                <Text variant="label-small" className="text-accent-red">
                                    O tamanho do arquivo ultrapassa o máximo
                                </Text>}
                            {error && <Text variant="label-small" className="text-accent-red">
                                {error}
                            </Text>}
                        </div>
                    </>
                ) : (
                    <>
                        {replaceBy}
                        <div className={`
                flex gap-3 items-center border border-solid border-border-primary mt-5
                p-3 rounded
                `}>
                            <Icon svg={FileImageIcon} className="fill-white w-6 h-6" />
                            <div className="flex flex-col">
                                <div className="truncate max-w-80">
                                    <Text variant="label-medium" className="text-placeholder">
                                        {formFile.name}
                                    </Text>
                                </div>
                                <div className="flex">
                                    <button type="button"
                                        className={textVariants({
                                            variant: "label-small",
                                            className: "text-accent-red cursor-pointer hover:underline"
                                        })}
                                        onClick={() => form.setValue(name, undefined)}
                                    >Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </div >
    )
}



