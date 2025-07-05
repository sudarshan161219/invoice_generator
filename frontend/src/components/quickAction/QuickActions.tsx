// src/components/dashboard/QuickActions.tsx
import type { FC, ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/button/Button";
import { Plus } from "lucide-react";
import { UserPlus, FilePlus } from "lucide-react";

export const QuickActions: FC = (): ReactElement | null => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname !== "/") return null;

  const handleCreateInvoice = () => navigate("/invoices/new");
  const handleAddClient = () => navigate("/clients/new");

  return (
    <div>
      <div className="sm:flex flex-col sm:flex-row justify-end gap-2 hidden">
        <Button
          variant="default"
          type="button"
          size="smMd"
          className="flex text-sm"
          onClick={handleCreateInvoice}
        >
          <Link className="flex items-center gap-1" to="/invoices/new">
            <Plus size={17} />
            <span>New Invoice</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          type="button"
          size="smMd"
          className="flex text-sm"
          onClick={handleAddClient}
        >
          <Link className="flex items-center gap-1" to="/clients/new">
            <Plus size={17} />
            <span>Add Client</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <Link className="flex items-center gap-1" to="/invoices/new">
          <FilePlus size={17} />
          <span className="hidden sm:inline">New Invoice</span>
        </Link>

        <Link className="flex items-center gap-1" to="/clients/new">
          <UserPlus size={17} />
          <span className="hidden sm:inline">Add Client</span>
        </Link>
      </div>
    </div>
  );
};
