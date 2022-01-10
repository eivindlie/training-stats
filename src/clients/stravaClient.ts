import { IAthlete } from "../types/contractTypes";
import { get } from "../utils/crud";

export const BASE_URL = "https://www.strava.com/api/v3";

export const getProfile = async (): Promise<IAthlete> => {
  return await get(`${BASE_URL}/athlete`);
};
