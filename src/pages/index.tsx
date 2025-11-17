import { Routes, Route } from "react-router-dom";
import { Home } from "./home";
import { Layout } from "../shared/layouts/layout";
import { Welcome } from "./welcome";
import { BookingPage } from "./booking";
import { AdminPage } from "./admin/admin";

export const Pages = () => (
  <Layout>
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </Layout>
);
