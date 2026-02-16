import Button from "../components/button";
import ButtonIcon from "../components/button-icon";
import ChevronLeftIcon from "../assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "../assets/icons/chevron-right.svg?react";
import Badge from "../components/badge";
import Alert from "../components/alert";
import Divider from "../components/divider";
import InputText from "../components/input-text";
import SearchIcon from "../assets/icons/search.svg?react";
import InputCheckbox from "../components/input-checkbox";
import InputSingleFile from "../components/input-single-file";
import { useForm } from 'react-hook-form';
import ImagePreview from "../components/image-preview";
import { Dialog, DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogBody, DialogContent, DialogFooter, DialogHeader } from "../components/dialog";
import Text from "../components/text";

export default function PageComponents() {
    const form = useForm();
    const file = form.watch('file');
    const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined

    return (
        <div className="grid gap-7 p-6">
            <div className="flex gap-3">
                <Button>Button</Button>
                <Button variant="secondary">Button</Button>
                <Button disabled>Button</Button>
                <Button handling>Loading</Button>
                <Button icon={ChevronRightIcon}>Próxima Imagem</Button>
                <Button variant="ghost" size="sm">
                    Button
                </Button>
                <Button variant="primary" size="sm">
                    Button
                </Button>
            </div>

            <div className="flex gap-3">
                <ButtonIcon icon={ChevronLeftIcon} />
                <ButtonIcon icon={ChevronRightIcon} variant="secondary" />
            </div>

            <div className="flex gap-3">
                <Badge>Todos</Badge>
                <Badge>Natureza</Badge>
                <Badge>Viagem</Badge>
                <Badge loading>Viagem</Badge>
                <Badge loading>Viagem</Badge>
                <Badge loading>Viagem</Badge>
            </div>

            <div>
                <Alert>
                    Tamanho máximo: 50MB
                    <br />
                    Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
                </Alert>
            </div>

            <div>
                <Divider />
            </div>

            <div>
                <InputText icon={SearchIcon} placeholder="Buscar foto" />
            </div>

            <div>
                <InputCheckbox />
            </div>

            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Abrir Modal</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>Teste Dialog</DialogHeader>
                        <DialogBody>
                            <Text as="div" className="mb-4">Teste conteúdo Dialog</Text>
                            <InputSingleFile
                                form={form}
                                allowedExtensios={['png', 'jpg', 'jpeg', 'webp']}
                                maxFileSizeInMB={50}
                                replaceBy={<ImagePreview src={fileSource} alt="Imagem" />}
                                {...form.register('file')}
                            />
                        </DialogBody>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <Button>Adicionar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

/* ------- FLUXO DE FILE --------

ETAPA 1 — Input HTML
<input type="file" name="file" />

Usuário escolhe um arquivo: [ foto.png ]
O browser sempre entrega uma lista, mesmo sendo um arquivo só: FileList → [ File ]

ETAPA 2 — register("file") Diz ao react-hook-form: Tudo que esse input emitir, guarda na chave file do form. Então o estado interno vira:

formValues = {
  file: [ File ]
}

ETAPA 3 — watch("file")
const file = form.watch("file");

Isso retorna o valor da chave file: file === [ File ] Aqui:

file → nome da variável
[File] → valor vindo do browser

ETAPA 4 — Acessando o arquivo real -> file?.[0] 
file → valor do campo do formulário, [0] → primeiro item da lista

file
 ↓
[ File ]
   ↓
   [0]
   ↓
   File { name, size, type }

*/

