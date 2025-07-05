import React from "react";
import type { Invoice } from "../types/invoice";

interface Props {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<Props> = ({ invoice }) => {
  const total = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="mt-3 p-4 border rounded  shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Invoice Preview</h2>

      <div>
        <strong>Invoice #: </strong>
        {invoice.invoiceNumber}
        <br />
        <strong>Issue Date: </strong>
        {invoice.issueDate}
        <br />
        <strong>Due Date: </strong>
        {invoice.dueDate}
      </div>

      <div>
        <h3 className="font-medium">Bill To:</h3>
        <p>{invoice.client.name}</p>
        <p>{invoice.client.email}</p>
        <p>{invoice.client.address}</p>
      </div>

      <table className="w-full text-sm border-t pt-2">
        <thead>
          <tr>
            <th className="text-left">Description</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{item.description}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="text-right">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-semibold">Total: ${total.toFixed(2)}</div>

      {invoice.notes && (
        <div>
          <h4 className="font-medium">Notes:</h4>
          <p>{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};
