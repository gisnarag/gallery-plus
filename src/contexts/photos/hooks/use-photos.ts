import { useQuery } from "@tanstack/react-query";
import type { Photo } from "../models/photo";
import { fetcher } from "../../../helpers/api";
import { useQueryState, createSerializer, parseAsString } from "nuqs";

/* 
    Para filtrar pelos álbums, vou usar o useQuery do nuqs, ele recebe um parâmetro obrigatório que é a chave, onde vai ser exibida na URL. A estrutura funciona como a de um estado (useState).

    No retorno coloca o albumId e o setAlbumId para ser usada em qualquer lugar, por exemplo como o estado fica na URL se eu compartilhar essa URL será exibido para outro usuário o mesmo conteúdo.

    o createSerializer é como um tradutor que traduz o estado JS para parâmetros da URL (e vice-versa), garantindo que a URL fique padronizada — e assim o React Query e a API conseguem usar esses valores corretamente. searchParams é a parte da URL depois do ?

*/

/*
  parseAsString Ensina ao nuqs que o albumId será lido e escrito como texto nos parâmetros da URL. 

    parseAsString é um parser (decodificador de tipo)

    URL sempre trabalha com texto
    React trabalha com tipos reais

    Então alguém precisa converter:

    "3"  ⇄  3
    "true" ⇄ true
    "2025-01-01" ⇄ Date

    O parseAsString é uma função pronta do nuqs que faz:

    URL → React  (ler)
    React → URL  (escrever)

    URL
    "?albumId=3"
        ↓
    parseAsString
        ↓
    React
    albumId = "3"

*/
const toSearchParams = createSerializer({
    albumId: parseAsString,
    q: parseAsString
});

export default function usePhotos() {
    const [albumId, setAlbumId] = useQueryState("albumId");
    const [q, setQ] = useQueryState("q");

    const { data, isLoading } = useQuery<Photo[]>({
        queryKey: ["photos", albumId, q],
        queryFn: () => fetcher(`/photos${toSearchParams({ albumId, q })}`)
    });

    return {
        photos: data || [],
        isLoadingPhotos: isLoading,
        filters: {
            albumId,
            setAlbumId,
            q,
            setQ
        }
    };
}