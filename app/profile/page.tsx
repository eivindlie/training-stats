import { getProfile } from "@/lib/strava/client";

const ProfilePage = async () => {
  const profile = await getProfile();

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

export default ProfilePage;
