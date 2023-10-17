import { useEffect, useState } from "react";

export function usePrefersDarkMode() {
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  useEffect(() => {
    setPrefersDarkMode(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  useEffect(() => {
    function handleDarkModePrefferedChange() {
      const doesMatch = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setPrefersDarkMode(doesMatch);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleDarkModePrefferedChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleDarkModePrefferedChange);
    };
  }, []);

  return prefersDarkMode;
}
