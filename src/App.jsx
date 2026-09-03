import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import MyPicksPage from "./pages/MyPicksPage";
import Home from "./pages/Home";
import Predictions from "./pages/Predictions";
import PredictionDetails from "./pages/PredictionDetails";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";
import Results from "./pages/Results";
import Tips from "./pages/Tips";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyPicks from "./components/MyPicks";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AddPrediction from "./pages/admin/AddPrediction";
import EditPrediction from "./pages/admin/EditPrediction";
import AdminLeagues from "./pages/admin/AdminLeagues";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminResults from "./pages/admin/AdminResults";
function App() {
  return (
    <>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/predictions/:id" element={<PredictionDetails />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:slug" element={<LeagueDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-picks" element={<MyPicksPage />} />
      </Route>
        <Route path="/admin/login" element={<AdminLogin />} />

<Route element={<ProtectedAdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route
  path="/admin/results"
  element={<AdminResults />}
/>
  <Route
  path="/admin/leagues"
  element={<AdminLeagues />}
/>
<Route
  path="/admin/teams"
  element={<AdminTeams />}
/>
    <Route path="/admin/predictions/new" element={<AddPrediction />} />
<Route
    path="/admin/predictions/:id/edit"
    element={<EditPrediction />}
  />
</Route>
    </Routes>
    <MyPicks />
    </>
  );
}

export default App;