import { Ghost } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

function Empty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="h-[50vh] flex flex-col justify-end items-center">
      <Ghost size={128} />
      <h2 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight line-clamp-6 mt-2">
        {title}
      </h2>
      <NavLink to="/" className="no-underline">
        <Button className="rounded-full mt-1">{subtitle}</Button>
      </NavLink>
    </div>
  );
}

export default Empty;
