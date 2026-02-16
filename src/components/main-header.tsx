import Container from "./container";
import Logo from "../assets/images/galeria-plus-full-logo.svg?react";
import { Link, useLocation } from "react-router";
import cx from "classnames";
import Button from "./button";
import PhotosSearch from "./photos-search";
import Divider from "./divider";
import PhotoNewDialog from "../contexts/photos/components/photo-new-dialog";
import AlbumNewDialog from "../contexts/albums/components/album-new-dialog";

/*
    Link navega por URL, nesse caso renderiza o LayoutMain com o PageHome dentro
    useLocation() → lê a URL atual do appm pathname → apenas o caminho da rota pathname === "/" → verifica se está na home, React re-renderiza automaticamente ao navegar
    useLocation é o “GPS do React Router”

    const { pathname } = useLocation();

    Você está dizendo:
    "Quero usar a localização atual do roteador dentro desse componente"

    Agora o React Router registra:

    Esse componente depende da localização
    Então quem observa quem?
    URL muda
    ↓
    React Router detecta
    ↓
    ele atualiza o contexto interno
    ↓
    todos componentes que usam useLocation re-renderizam
    ↓
    pathname recebe novo valor
    Ou seja:

    o React Router observa a navegação

*/

interface MainHeaderProps extends React.ComponentProps<"div"> { }

export default function MainHeader({ className, ...props }: MainHeaderProps) {
    const { pathname } = useLocation();

    return <Container as="header" className={cx("flex justify-between items-center gap-10", className)} {...props}>
        <Link to="/">
            <Logo className="h-5" />
        </Link>

        {pathname === "/" &&
            <>
                <PhotosSearch />
                <Divider orientation="vertical" className="h-10" />

            </>}

        <div className="flex items-center gap-3">
            <PhotoNewDialog trigger={<Button> Nova Foto</Button>} />

            <AlbumNewDialog trigger={<Button variant="secondary">Criar álbum</Button>} />
        </div>
    </Container >
}