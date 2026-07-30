import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Ctx = {
  selectedCourse: string;
  setSelectedCourse: (v: string) => void;
  enroll: (course?: string) => void;
  isEnrollOpen: boolean;
  openEnroll: (course?: string) => void;
  closeEnroll: () => void;
};

const EnrollCtx = createContext<Ctx>({
  selectedCourse: "",
  setSelectedCourse: () => {},
  enroll: () => {},
  isEnrollOpen: false,
  openEnroll: () => {},
  closeEnroll: () => {},
});

export function EnrollProvider({ children }: { children: ReactNode }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const openEnroll = useCallback((course?: string) => {
    if (course) setSelectedCourse(course);
    setIsEnrollOpen(true);
  }, []);
  const closeEnroll = useCallback(() => setIsEnrollOpen(false), []);
  const enroll = useCallback(
    (course?: string) => {
      if (course) setSelectedCourse(course);
      setIsEnrollOpen(true);
    },
    [],
  );
  return (
    <EnrollCtx.Provider
      value={{ selectedCourse, setSelectedCourse, enroll, isEnrollOpen, openEnroll, closeEnroll }}
    >
      {children}
    </EnrollCtx.Provider>
  );
}

export const useEnroll = () => useContext(EnrollCtx);