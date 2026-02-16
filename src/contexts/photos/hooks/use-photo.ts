import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, fetcher } from "../../../helpers/api";
import type { Photo } from "../models/photo";
import type { PhotoNewFormSchema } from "../schemas";
import { toast } from "sonner";
import usePhotoAlbums from "./use-photo-albums";
import { useNavigate } from "react-router";

// Resposta do detalhe da foto da API
interface PhotoDetailResponse extends Photo {
    previousPhotoId?: string;
    nextPhotoId?: string;
}

/*
 O data do useQuery agora possui as duas novas propriedades do PhotoDetailResponse e estende as de Photo
 enabled recebe valor boolean, o !! converte id que inicialmente é string para boolean, se id existir é true, senão false

 pnpm add sonner
 Sonner é uma biblioteca de notificações (toast) para dar feedback ao usuário.
 O <Toaster /> é configurado uma única vez no App e define onde as mensagens aparecerão na tela.
 Depois, em qualquer parte do projeto, usamos a função `toast()` para exibir mensagens
 como sucesso, erro ou carregando após executar alguma ação (ex: criar uma foto).
*/

export default function usePhoto(id?: string) {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery<PhotoDetailResponse>({
        queryKey: ["photos", id],
        queryFn: () => fetcher(`/photos/${id}`),
        enabled: !!id
    });
    const queryClient = useQueryClient();
    const { managePhotoOnAlbum } = usePhotoAlbums();

    async function createPhoto(payload: PhotoNewFormSchema) {
        try {
            const { data: photo } = await api.post<Photo>("/photos", {
                title: payload.title
            });

            await api.post(`/photos/${photo.id}/image`, {
                file: payload.file[0],
            },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

            if (payload.albumsIds && payload.albumsIds.length > 0) {
                await managePhotoOnAlbum(photo.id, payload.albumsIds)
            }

            queryClient.invalidateQueries({ queryKey: ["photos"] });

            toast.success("Foto criada com sucesso!");
        } catch (error) {
            toast.error("Erro ao criar foto");
            throw error;
        }
    }

    async function deletePhoto(photoId: string) {
        try {
            await api.delete(`/photos/${photoId}`)

            toast.success("Foto excluída com sucesso")

            navigate("/");
        } catch (error) {
            toast.error("Erro ao excluir foto")
            throw error;
        }
    }

    return {
        photo: data,
        previousPhotoId: data?.previousPhotoId,
        nextPhotoId: data?.nextPhotoId,
        isLoadingPhoto: isLoading,
        createPhoto,
        deletePhoto,
    };
}

