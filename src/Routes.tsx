import { Routes as ReactRoutes, Route } from "react-router-dom";

import { ActivityStats, Profile } from "components";

export const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<ActivityStats />} />
      <Route path="/profile" element={<Profile />} />
    </ReactRoutes>
  );
};
