import { Routes, Route } from "react-router-dom";
import Test from "@/views/test.tsx";
import Layout from '@/components/Layout'
import Landing from '@/views/Landing';
import Project from '@/views/Project';
import Documentation from '@/views/Documentation';
import About from '@/views/About';
import ConfigureProject from "@/components/Project/ConfigureProject";
import RunProject from "@/components/Project/RunProject";

const router: React.FC = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/project" element={<Layout><Project /></Layout>} />
      <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/project/setup" element={<ConfigureProject />} />
      <Route path="/project/run" element={<RunProject />} />
    </Routes>
  );
};

export default router;