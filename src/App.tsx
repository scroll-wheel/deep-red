import Comments from "@/pages/Comments";
import Top from "@/pages/Top";
import Empty from "@/pages/Empty";
import { HashRouter, Routes, Route, NavLink } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Form from "@/components/Form";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HashRouter>
          <nav className="bg-background flex md:grid grid-cols-[1fr_4fr_1fr] p-3 pb-1.5 sticky z-2 top-0 border-b">
            <NavLink to="/" className="flex items-center">
              <span className="avatar"></span>
              <h1 className="hidden md:block scroll-m-20 text-3xl font-semibold tracking-tight">
                deep red
              </h1>
            </NavLink>
            <Form />
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </nav>
          <main className="px-3 md:p-0 md:w-3xl m-auto">
            <Routes>
              <Route
                path="/r/:subreddit/top/:year?/:month?/:day?"
                element={<Top />}
              />
              <Route
                path="/r/:subreddit/comments/:id/:slug?"
                element={<Comments />}
              />
              <Route
                path="*"
                element={
                  <Empty
                    title="Page Not Found"
                    subtitle="Explore Reddit Communities"
                  />
                }
              />
            </Routes>
          </main>
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
