import React, { useEffect, useState } from "react";
import type { Invoice, LineItem } from "../types/invoice";

const defaultLineItem: LineItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

const emptyInvoice: Invoice = {
  invoiceNumber: "",
  issueDate: "",
  dueDate: "",
  client: {
    name: "",
    email: "",
    phone: 1,
    company: "",
    address: "",
    notes: "",
  },
  items: [defaultLineItem],
  notes: "",
};

interface InvoiceFormProps {
  onChange: (invoice: Invoice) => void;
  initialInvoice?: Invoice;
  persistKey?: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onChange,
  initialInvoice,
  persistKey = "invoice",
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const [invoice, setInvoice] = useState<Invoice>(
    initialInvoice ?? emptyInvoice
  );

  // Load from sessionStorage if no initialInvoice
  useEffect(() => {
    if (!initialInvoice) {
      const stored = sessionStorage.getItem(persistKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setInvoice(parsed);
          onChange(parsed);
        } catch {
          console.error("Invalid stored invoice data");
        }
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome/Firefox
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [initialInvoice, persistKey, onChange, isSaved]);

  const handleSave = () => {
    setIsSaved(true);
    // maybe call some backend API or move to next tab
  };

  const updateInvoice = (updated: Invoice) => {
    setInvoice(updated);
    sessionStorage.setItem(persistKey, JSON.stringify(updated));
    onChange(updated);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateInvoice({ ...invoice, [name]: value });
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateInvoice({
      ...invoice,
      client: { ...invoice.client, [name]: value },
    });
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newItems = [...invoice.items];
    newItems[index] = {
      ...newItems[index],
      [name]: name === "description" ? value : Number(value),
    };
    updateInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => {
    updateInvoice({ ...invoice, items: [...invoice.items, defaultLineItem] });
  };

  const removeItem = (index: number) => {
    const items = invoice.items.filter((_, i) => i !== index);
    updateInvoice({ ...invoice, items });
  };

  return (
    <div className="flex flex-col  gap-3">
      {/* Form Section */}
      <form className="flex-1 space-y-4 p-4 border rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="invoiceNumber"
            placeholder="Invoice #"
            value={invoice.invoiceNumber}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            name="issueDate"
            type="date"
            value={invoice.issueDate}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            name="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={handleInputChange}
            className="border p-2"
          />
        </div>

        <h3 className="font-medium">Client Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Client Name"
            value={invoice.client.name}
            onChange={handleClientChange}
            className="border p-2"
          />
          <input
            name="email"
            placeholder="Client Email"
            value={invoice.client.email}
            onChange={handleClientChange}
            className="border p-2"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={invoice.client.phone || ""}
            onChange={handleClientChange}
            className="border p-2"
          />
          <input
            name="company"
            placeholder="Company"
            value={invoice.client.company || ""}
            onChange={handleClientChange}
            className="border p-2"
          />
          <input
            name="address"
            placeholder="Client Address"
            value={invoice.client.address}
            onChange={handleClientChange}
            className="border p-2 col-span-2"
          />
        </div>

        <h3 className="font-medium">Line Items</h3>
        {invoice.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 items-center">
            <input
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              name="quantity"
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              name="unitPrice"
              type="number"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-blue-500 underline"
        >
          + Add Item
        </button>

        <textarea
          name="notes"
          placeholder="Notes"
          value={invoice.notes}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
      </form>

      <button
        type="button"
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Draft
      </button>
    </div>
  );
};
