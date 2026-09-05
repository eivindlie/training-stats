import { useEffect, useState } from "react";
import { getProfile } from "../clients/stravaClient";
import { IAthlete } from "../types/contractTypes";

export const Profile = () => {
  const [profile, setProfile] = useState<IAthlete>();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return <div>Laster...</div>;
  }

  return (
    <dl>
      <dt>Navn</dt>
      <dd>
        {profile.firstname} {profile.lastname}
      </dd>
      <dt>Brukernavn</dt>
      <dd>{profile.username}</dd>
      <dt>Vekt</dt>
      <dd>{profile.weight} kg</dd>
    </dl>
  );
};
