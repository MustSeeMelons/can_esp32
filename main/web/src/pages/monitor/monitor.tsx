import { useState } from "preact/hooks";
import { Card } from "../../components/card/card";
import "./monitor.scss";

export const MonitorPage = () => {
  const [items] = useState(Array(20).fill(1));

  return (
    <div class="monitor-page">
      {items.map((i) => {
        return (
          <Card>
            <p>code {i}</p>
            the description
          </Card>
        );
      })}
    </div>
  );
};
