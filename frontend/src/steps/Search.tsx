import { useState, useEffect } from "react";
import { Data } from "../types";
import { searchData } from "../services/search";
import { useDebounce } from "@uidotdev/usehooks";
import { Toaster, toast } from "sonner";

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });
  const debouncedSearch = useDebounce(search, 500);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const newPathname =
      search == "" ? window.location.pathname : `?q=${debouncedSearch}`;
    window.history.pushState({}, "", newPathname);
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch == "") {
      setData(initialData);
      return;
    }
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response;
      if (err) {
        toast.error(err.message);
        return;
      }
      if (newData) {
        setData(newData);
      }
    });
  }, [debouncedSearch, initialData]);

  return (
    <>
      <Toaster />
      <div>
        <h1>Search</h1>
        <form>
          <input
            onChange={handleSearch}
            type="search"
            placeholder="Search info.."
            defaultValue={search}
          />
        </form>
        <ul>
          {data.map((row) => (
            <li key={row.id}>
              <article>
                {Object.entries(row).map(([key, value]) => (
                  <p key={key}>
                    {key} <span>{value}</span>{" "}
                  </p>
                ))}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
