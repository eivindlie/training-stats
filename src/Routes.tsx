import { Routes as ReactRoutes, Route } from "react-router-dom";

import { ActivityStats } from "./components/ActivityStats";
import { Profile } from "./components/Profile";

export const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<ActivityStats />} />
      <Route path="/profile" element={<Profile />} />
    </ReactRoutes>
  );
};
