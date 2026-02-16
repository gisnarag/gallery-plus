import React from 'react';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../components/dialog";
import Button from '../../../components/button';
import InputText from '../../../components/input-text';
import Alert from '../../../components/alert';
import InputSingleFile from '../../../components/input-single-file';
import ImagePreview from '../../../components/image-preview';
import Text from "../../../components/text";
import Skeleton from '../../../components/skeleton';
import { useForm } from 'react-hook-form';
import useAlbums from '../../albums/hooks/use-albums';
import { photoNewFormSchema, type PhotoNewFormSchema } from '../schemas';
import { zodResolver } from "@hookform/resolvers/zod";
import usePhoto from '../hooks/use-photo';

// “trigger é o elemento que DISPARA alguma ação da lib do Radix que estou usando.
interface PhotoNewDialogProps {
    trigger: React.ReactNode;
}

export default function PhotoNewDialog({ trigger }: PhotoNewDialogProps) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const form = useForm<PhotoNewFormSchema>({
        resolver: zodResolver(photoNewFormSchema) // Resolve o formulário com base no schema tipado dentro de useForm (pnpm add @hookform/resolver) Quando clicar no submit, ele vai pegar todos os dados do formulário e tentar resolver baseado no schema
    });
    const { albums, isLoadingAlbums } = useAlbums();
    const { createPhoto } = usePhoto();
    const [isCreatingPhoto, setIsCreatingPhoto] = React.useTransition();

    const file = form.watch("file");
    const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined

    const albumsIds = form.watch("albumsIds");

    React.useEffect(() => {
        if (!modalOpen) {
            form.reset();
        }
    }, [modalOpen, form])

    // Adicionar ou remover um álbum da lista de álbuns selecionados.
    // new Set não permite repetir Id da lista
    function handleToggleAlbum(albumId: string) {
        const albumsIds = form.getValues("albumsIds") || [];
        const albumsSet = new Set(albumsIds);

        if (albumsSet.has(albumId)) {
            albumsSet.delete(albumId)
        } else {
            albumsSet.add(albumId)
        }

        form.setValue("albumsIds", Array.from(albumsSet))
    }

    function handleSubmit(payload: PhotoNewFormSchema) {
        setIsCreatingPhoto(async () => {
            await createPhoto(payload)
            setModalOpen(false)
        });
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <DialogHeader>Adicionar foto</DialogHeader>

                    <DialogBody className="flex flex-col gap-5">
                        <InputText
                            placeholder="Adicione um título"
                            maxLength={255}
                            error={form.formState.errors.title?.message}
                            {...form.register("title")} />

                        <Alert>
                            Tamanho máximo: 50MB
                            <br />
                            Você pode selecionar arquivos em PNG, JPG, ou JPEG
                        </Alert>

                        <InputSingleFile form={form}
                            allowedExtensios={['png', 'jpg', 'jpeg']}
                            maxFileSizeInMB={50}
                            replaceBy={<ImagePreview src={fileSource} className="w-full h-56" />}
                            error={form.formState.errors.file?.message}
                            {...form.register("file")}
                        />

                        <div className="space-y-3">
                            <Text variant="label-small">Selecionar álbum</Text>

                            <div className="flex flex-wrap gap-3">
                                {!isLoadingAlbums && albums.length > 0 && albums.map(album =>
                                    <Button
                                        key={album.id}
                                        variant={albumsIds?.includes(album.id) ? "primary" : "ghost"}
                                        size="sm"
                                        className="truncate"
                                        onClick={() => handleToggleAlbum(album.id)}>
                                        {album.title}
                                    </Button>
                                )}

                                {isLoadingAlbums && Array.from({ length: 5 }).map((_, index) => <Skeleton key={`album-loading-${index}`} className="w-20 h-7" />)}
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={isCreatingPhoto}>Cancelar</Button>
                        </DialogClose>

                        <Button disabled={isCreatingPhoto} handling={isCreatingPhoto} type="submit">{isCreatingPhoto ? "Adicionando..." : "Adicionar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}