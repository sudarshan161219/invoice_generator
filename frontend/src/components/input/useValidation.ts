import { useState, useEffect } from "react";

const messages = {
  username: "Only letters, numbers, and single hyphens (not at start or end).",
  password: "Use 15+ chars, or 6+ with uppercase, lowercase, number & symbol.",
  email: "Please use a valid email.",
};

export const useValidation = (name?: string, value: string = "") => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return setError(null);

    if (name === "username") {
      const isValid = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value);
      setError(isValid ? null : messages.username);
    }

    if (name === "password") {
      const longEnough = value.length >= 15;
      const secureEnough =
        value.length >= 6 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value) &&
        /[^A-Za-z0-9]/.test(value);

      setError(longEnough || secureEnough ? null : messages.password);
    }

    if (name === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setError(isValid ? null : messages.email);
    }
  }, [name, value]);

  return error;
};
