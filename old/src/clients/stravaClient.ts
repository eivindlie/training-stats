import { IActivity, IAthlete } from "../types/contractTypes";
import { get } from "../utils/crud";

export const BASE_URL = "https://www.strava.com/api/v3";

export const getProfile = async (): Promise<IAthlete> => {
  return await get(`${BASE_URL}/athlete`);
};

export const getActivitiesBetween = async (
  startDate: Date,
  endDate: Date
): Promise<IActivity[]> => {
  console.log(startDate, endDate);
  return await get(
    `${BASE_URL}/athlete/activities?after=${
      startDate.getTime() / 1000
    }&before=${endDate.getTime() / 1000}&per_page=200`
  );
};
