import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/useQeryProvider";
import { Pages } from "@/pages";

export const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </QueryProvider>
  );
};
