import { useState } from "react";

export const Company = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", { email });
    // Here you would call your API to save changes
  };

  return <div>Company</div>;
};
