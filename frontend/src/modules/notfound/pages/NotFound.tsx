import type { FC, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import notFound from "@/assets/404 error with portals-cuate.svg";
import "./index.css";

export const NotFound: FC = (): ReactElement => {
  return (
    <div className="p-4 relative h-screen items-center justify-center flex flex-col">
      <img className="not-found-img" src={notFound} alt="404 Not Found" />

      <Link to="/">
        <Button className="cursor-pointer">Go to Dashboard</Button>
      </Link>
    </div>
  );
};
