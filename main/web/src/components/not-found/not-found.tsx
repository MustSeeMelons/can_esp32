import "./not-found.scss";
import { FileWarning } from "lucide-preact";

export const NotFound = () => {
  return (
    <div class="not-found">
      <FileWarning size={40} />
      <p>Not Found!</p>
    </div>
  );
};
