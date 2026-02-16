import { useQuery } from "@tanstack/react-query"
import type { Album } from "../models/album"
import { fetcher } from "../../../helpers/api"

// useQuery é o hook que pede dados ao servidor e guarda no cache.
// Desestruturando data, isLoading do objeto do retorno do useQuery
export default function useAlbums() {
    const { data, isLoading } = useQuery<Album[]>({
        queryKey: ["albums"],
        queryFn: () => fetcher("/albums")
    })

    return {
        albums: data || [],
        isLoadingAlbums: isLoading
    }
}