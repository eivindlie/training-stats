import { Routes as ReactRoutes, Route } from "react-router-dom";

import { ActivityStatList, Profile } from "components";

export const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<ActivityStatList />} />
      <Route path="/profile" element={<Profile />} />
    </ReactRoutes>
  );
};
