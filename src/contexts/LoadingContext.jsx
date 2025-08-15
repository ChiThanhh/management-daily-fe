import React, { createContext, useContext, useState } from "react";
import { Loader } from "lucide-react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
          <Loader className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
