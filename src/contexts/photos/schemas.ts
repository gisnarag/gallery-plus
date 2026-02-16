import { z } from 'zod';

/* 
    Um schema é o formato oficial que os dados devem ter, como um molde. 
    Descreve como um objeto nesse caso de formulário deve ser, qualquer coisa fora disso → inválido
    O meu formulário deve retornar um objeto com as propriedades que eu defini
    mínimo -> um caracter e caso o user não digite, e aperte em adicionar, o message é exibido

    Quando você usa no HTML:

    <input type="file" />

    e o usuário seleciona arquivos, o navegador retorna um objeto especial: FileList
    
    instanceof verifica se um valor foi criado por um tipo específico.
    O campo file só é válido se vier diretamente de um <input type = "file">

    O refine serve para criar uma regra personalizada de validação depois que o tipo básico já foi validado.

    A lista de álbuns contém os IDs dos álbuns selecionados.
    Cada ID é um UUID, pois o backend identifica cada álbum por um identificador único.

*/
export const photoNewFormSchema = z.object({
    title: z.string().min(1, { message: "Campo obrigatório" }).max(255),
    file: z.instanceof(FileList).refine(file => file.length > 0, { message: "Campo obrigatório" }),
    albumsIds: z.array(z.string().uuid()).optional(),
})

// Transforma as propriedades em um tipo
export type PhotoNewFormSchema = z.infer<typeof photoNewFormSchema>
