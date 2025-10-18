import { Routes, Route } from "react-router-dom";
import { Home } from "./home";
import { Layout } from "../shared/layouts/layout";

export const Pages = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Layout>
);
