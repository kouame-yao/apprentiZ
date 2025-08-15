import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const ApplicationContext = React.createContext([]);

function ApplicationContextProvider({ children }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [uid, setUid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${url}/api/profil/getprofil`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
        }
        return res.json();
      })
      .then((data) => setUid(data?.uid))
      .catch(() => router.push("/login"));
  }, [router]);
  return (
    <ApplicationContext.Provider value={{ uid }}>
      <section>{children}</section>
    </ApplicationContext.Provider>
  );
}

export default ApplicationContextProvider;
