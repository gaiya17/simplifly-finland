import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { WhoWeAre } from "./pages/WhoWeAre";
import { SriLankaTours } from "./pages/SriLankaTours";
import { SriLankaTourCategory } from "./pages/SriLankaTourCategory";
import { MaldivesResorts } from "./pages/MaldivesResorts";
import { MaldivesResortsCategory } from "./pages/MaldivesResortsCategory";
import { ResortPackage } from "./pages/ResortPackage";
import { BlogPage } from "./pages/BlogPage";
import { GalleryPage } from "./pages/GalleryPage";
import { TourPackage } from "./pages/TourPackage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "who-we-are", Component: WhoWeAre },
      { path: "sri-lanka-tours", Component: SriLankaTours },
      { path: "sri-lanka-tours/:categoryId", Component: SriLankaTourCategory },
      { path: "sri-lanka-tours/:categoryId/:packageId", Component: TourPackage },
      { path: "maldives-resorts", Component: MaldivesResorts },
      { path: "maldives-resorts/:categoryId", Component: MaldivesResortsCategory },
      { path: "maldives-resorts/:categoryId/:resortId", Component: ResortPackage },
      { path: "blog", Component: BlogPage },
      { path: "gallery", Component: GalleryPage }
    ],
  },
]);