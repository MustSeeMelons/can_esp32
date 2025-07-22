import { useContext, useEffect } from "preact/hooks";
import "./header.scss";
import { Moon, Sun, KeySquare } from "lucide-preact";
import { Theme, ThemeContext } from "../../theme-provider/theme.provider";
import { ModalContext } from "../../modal-provider/modal-provider";
import { Button } from "../button/button";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { pushModal, popModal } = useContext(ModalContext);

  useEffect(() => {
    pushModal(
      "test",
      <div style={{ padding: "20px", backgroundColor: "pink" }}>
        <Button
          onClick={() => {
            pushModal(
              "test2",
              <div style={{ padding: "20px", backgroundColor: "green" }}>
                <Button
                  onClick={() => {
                    popModal();
                  }}
                >
                  Click me too!
                </Button>
              </div>
            );
          }}
        >
          Click me!
        </Button>
      </div>
    );
  }, []);

  return (
    <div class="header">
      <ul>
        <li>
          <KeySquare size="35px" />
          <p style={{ marginLeft: "10px" }}>OBD Thing</p>
        </li>
        <li>
          <a is="preact-router" href="/monitor">
            Monitor
          </a>
        </li>
        <li>
          <a is="preact-router" href="/tbd">
            TBD
          </a>
        </li>
        <li onClick={toggleTheme}>
          {theme === Theme.Dark ? <Sun size="30px" /> : <Moon size="30px" />}
        </li>
      </ul>
    </div>
  );
};
