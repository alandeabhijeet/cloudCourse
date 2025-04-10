import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Courses from "@/pages/Courses";
import Buy from "@/pages/Buy";
import Owner from "@/pages/Owner";
import Add from "@/pages/Add";
import Edit from "@/pages/Edit";
import CourseDetails from "@/pages/CourseDetails";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          {/* ✅ PROTECTED ROUTE: Only logged-in users can access `/courses` */}
          <Route path="courses" element={<ProtectedRoute />}>
            <Route index element={<Courses />} />
          </Route>

          <Route path="buy" element={<ProtectedRoute />}>
            <Route index element={<Buy />} />
          </Route>

          <Route path="owner" element={<ProtectedRoute />}>
            <Route index element={<Owner />} />
          </Route>

          <Route path="add" element={<ProtectedRoute />}>
            <Route index element={<Add />} />
          </Route>

          <Route path="edit/:id" element={<ProtectedRoute />}>
            <Route index element={<Edit />} />
          </Route>

          {/* ✅ PROTECTED COURSE DETAILS */}
          <Route path="courses/:id" element={<ProtectedRoute />}>
            <Route index element={<CourseDetails />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
