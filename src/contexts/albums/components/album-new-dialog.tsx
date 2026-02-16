import React from 'react';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../../../components/dialog';
import Button from '../../../components/button';
import InputText from '../../../components/input-text';
import Text from '../../../components/text';
import SelectCheckboxIlustration from "../../../assets/images/select-checkbox.svg?react";
import Skeleton from '../../../components/skeleton';
import PhotoImageSelectable from '../../photos/components/photo-image-selectable';
import usePhotos from '../../photos/hooks/use-photos';
import { useForm } from 'react-hook-form';
import { albumNewFormSchema, type AlbumNewFormSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import useAlbum from '../hooks/use-album';

interface AlbumNewDialogProps {
    trigger: React.ReactNode;
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
    const [modalOpen, setModalOpen] = React.useState(false);

    // resolver para resolver os dados do formulário com base no schema criado
    // form aqui é um objeto criado pelo RHF. Ele contém funções como reset(), setValue(), getValues() e informações internas do formulário (valores dos inputs, erros, estados “touched” etc.).
    const form = useForm<AlbumNewFormSchema>({
        resolver: zodResolver(albumNewFormSchema)
    })
    const { photos, isLoadingPhotos } = usePhotos();
    const { createAlbum } = useAlbum();
    const [isCreatingAlbum, setIsCreatingAlbum] = React.useTransition();

    // Limpa o formulário ao fechar o modal
    // React vê que você usou form.reset(). Cria um closure, que é basicamente uma função que lembra a referência do form naquele render. form.reset() → é a razão pela qual o React precisa “lembrar” do form.
    // Por isso, é importante colocar form na dependência para criar uma nova closure (referência) quando ele mudar, [modalOpen, form] → garante que o effect sempre tenha a referência mais atual do form
    React.useEffect(() => {
        if (!modalOpen) {
            form.reset();
        }

    }, [modalOpen, form])

    function handleTogglePhoto(selected: boolean, photoId: string) {
        // No RHF, getValues é uma função que lê os valores atuais do formulário, essa função está lendo do campo 'photosIds', tipado do schema no useForm.
        const photosIds = form.getValues('photosIds') || [];

        if (selected) {
            form.setValue('photosIds', [...photosIds, photoId])
        } else {
            form.setValue(
                "photosIds",
                photosIds.filter((id) => id !== photoId)
            )
        };
    }

    function handleSubmit(payload: AlbumNewFormSchema) {
        setIsCreatingAlbum(async () =>
            await createAlbum(payload));
        setModalOpen(false);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <DialogHeader>Criar álbum</DialogHeader>

                    <DialogBody className="flex flex-col gap-5">
                        <InputText placeholder="Adicione um título"
                            error={form.formState.errors.title?.message}
                            // O register é como o React Hook Form passa a enxergar o input.
                            {...form.register('title')} />

                        <div className="space-y-3">
                            <Text as="div" variant="label-small" className="mb-3">Fotos cadastradas</Text>

                            {isLoadingPhotos && (
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton
                                            key={`photo-loading-${index}`}
                                            className="w-20 h-20 rounded-lg"
                                        />))}
                                </div>
                            )}

                            {!isLoadingPhotos && photos.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {photos.map((photo) => (
                                        <PhotoImageSelectable
                                            key={photo.id}
                                            src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
                                            title={photo.title}
                                            imageClassName="w-20 h-20"
                                            onSelectImage={(selected) => handleTogglePhoto(selected, photo.id)} />
                                    ))}
                                </div>
                            )}

                            {!isLoadingPhotos && photos.length === 0 && (
                                <div className="w-full flex flex-col justify-center items-center gap-3">
                                    <SelectCheckboxIlustration />
                                    <Text variant="paragraph-medium" className="text-center">Nenhuma foto disponível para seleção</Text>
                                </div>
                            )}
                        </div>

                    </DialogBody>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={isCreatingAlbum}>Cancelar</Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={isCreatingAlbum}
                            handling={isCreatingAlbum}>
                            {isCreatingAlbum ? "Criando..." : "Criar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

/*

    Fluxo 

 Usuário clica criar
        ↓
 React Hook Form pega os valores dos inputs
        ↓
 envia para o resolver (zodResolver)
        ↓
 Zod compara com o schema
        ↓
 RETORNA:
   válido → chama seu handleSubmit
   inválido → preenche formState.errors

*/

/*
    Sem register
INPUT (HTML)
   |
   | digita texto
   v
Ninguém sabe o valor 
React Hook Form não recebe nada


O campo existe na tela…
mas o formulário não tem acesso ao valor.

Com register
INPUT
   |
   | register("title")
   v
register marca que o valor desse input está no title

Agora sempre que você digita:

Você digita:  "Foto da praia"

INPUT ----evento onChange----> RHF guarda:
                               { title: "Foto da praia" }


Ou seja:

Coisa	Pra que serve
name	identifica o campo
onChange	captura o valor digitado
onBlur	marca como tocado
ref	conecta ao DOM

Fluxo completo:

1) register conecta o input
2) RHF captura os valores
3) resolver valida os valores
4) errors recebe mensagens

*/
