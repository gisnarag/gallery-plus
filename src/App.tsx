import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageComponents from "./pages/page-components";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import PagePhotoDetails from "./pages/page-photo-details";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "sonner";

// É importante configurar o provedor do React Query antes de usar ele, o QueryClientProvider é o lugar onde o React Query cria um cache global onde todas as requisições ficam armazenadas e compartilhadas entre os componentes.
/*
	new QueryClient() -> É o objeto que cria a memória (cache) do React Query. Ele é literalmente o “cérebro” que vai guardar, dados das requisições, loading, erro, sem ele o React Query não tem onde salvar nada.

*/
const queryClient = new QueryClient()

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				<BrowserRouter>
					<Toaster position="bottom-center" />
					<Routes>
						<Route element={<LayoutMain />}>
							<Route index element={<PageHome />} />
							<Route path="/fotos/:id" element={<PagePhotoDetails />} />
							<Route path="/componentes" element={<PageComponents />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</NuqsAdapter>
		</QueryClientProvider >
	);
}


/* 
	  O React Router renderiza o element quando o path é acessado.
	Outlet é o buraco do layout onde a rota filha entra, entre o Header e o Footer.
	  Route do tipo index é a página padrão/inicial da rota pai e não usa path. O próprio React Router renderiza quando a rota pai é acessada ("/"). Acessou / → entra no LayoutMain → como não tem path extra → renderiza a rota index (PageHome)

	  :id é um parâmetro de rota (route param), um placeholder na URL. O React Router lê :id e entrega através de um hook useParams() -> { id: "19" } -> Frontend usa esse id -> Backend recebe /fotos/19. 

*/