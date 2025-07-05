import { useEffect, useState } from "react";

const mockClients = [
  { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Corp" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", company: "Beta LLC" },
];

export function ClientTable({ search }: { search: string }) {
  const [filtered, setFiltered] = useState(mockClients);

  useEffect(() => {
    setFiltered(
      mockClients.filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.email.toLowerCase().includes(search.toLowerCase()) ||
          client.company.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Company</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((client) => (
            <tr key={client.id} className="border-t">
              <td className="p-2">{client.name}</td>
              <td className="p-2">{client.email}</td>
              <td className="p-2">{client.company}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
