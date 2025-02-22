import { ApiSearchResponse, Data } from "../types";
export const searchData = async (
  search: string
): Promise<[Error | null, Data?]> => {
  try {
    const res = await fetch(`http://localhost:3000/api/users?q=${search}`);

    if (!res.ok) {
      return [new Error(`Error searching data: ${res.statusText}`)];
    }
    const json = await res.json() as ApiSearchResponse;
    return [null, json.data];
  } catch (error) {
    if (error instanceof Error) {
      return [error];
    } else {
      return [new Error("Unknown error")];
    }
  }
};
