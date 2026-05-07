import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../shared/layouts/layout";
import { LoadingSpinner } from "@/shared/ui/button/loading/loading";

const Home = lazy(() => import("./home"));
const Welcome = lazy(() => import("./welcome"));
const BookingPage = lazy(() => import("./booking"));
const AdminPage = lazy(() => import("./admin"));
const BanPage = lazy(() => import("./ban"));
const LoginPage = lazy(() => import("./login"));

export const Pages = () => (
  <Layout>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/ban" element={<BanPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Suspense>
  </Layout>
);
