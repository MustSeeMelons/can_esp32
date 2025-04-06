import { useContext } from "preact/hooks";
import { Card } from "../../components/card/card";
import "./monitor.scss";
import { StoreContext } from "../../store-provider/store-provider";

export const MonitorPage = () => {
  const { canMessages } = useContext(StoreContext);

  return (
    <div class="monitor-page">
      {Object.keys(canMessages).map((typeKey) => {
        return (
          <Card>
            <p>{typeKey}</p>
            {JSON.stringify(canMessages[+typeKey], null, 2)}
          </Card>
        );
      })}
    </div>
  );
};
