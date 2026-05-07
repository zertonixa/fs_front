import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/useQeryProvider";
import { HelmetProvider } from 'react-helmet-async';
import { Pages } from "@/pages";

export const App = () => {
  return (
    <QueryProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </HelmetProvider>
    </QueryProvider>
  );
};
