import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient } from "../../api/get.client.api";
import { useInvoiceClient } from "@/hooks/useInvoiceClient";

export const ClientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const { client, clientName, setClient, setClientName } = useInvoiceClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const { data } = await getClient(Number(id));
        setClient(data);
        setClientName(data.name);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch client:", err);
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, setClient, setClientName]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading client data...</div>;
  }

  if (!client) {
    return <div className="p-4 text-red-500">Client not found.</div>;
  }

  const { name, email, phone, company, address, createdAt, notes } = client;

  return (
    <div className="p-6 max-w-3xl mx-auto rounded-xl shadow-md space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={
            client.imageUrl ||
            `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`
          }
          alt={client.name}
          className="w-20 h-20 rounded-full border shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-bold">{clientName}</h1>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Phone:</span> {phone || "—"}
        </div>
        <div>
          <span className="font-medium">Company:</span> {company || "—"}
        </div>
        <div>
          <span className="font-medium">Address:</span> {address || "—"}
        </div>
        <div>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {notes && Array.isArray(notes) && notes.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Notes</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            {(notes as string[]).map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
