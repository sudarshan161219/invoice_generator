import { useState } from "react";

export const General = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated General Info:", { name, email });
    // Here you would call your API to save changes
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter client's name"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter client's email"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Save
      </button>
    </form>
  );
};
