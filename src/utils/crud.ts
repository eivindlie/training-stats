import { getToken } from "./auth";

export const get = async (url: string): Promise<any> => {
  const response = await sendRequest(url);
  return await response.json();
};

const sendRequest = async (
  url: string,
  method: string = "GET"
): Promise<Response> => {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
