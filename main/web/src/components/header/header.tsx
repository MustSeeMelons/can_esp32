import { useContext } from "preact/hooks";
import "./header.scss";
import { Moon, Sun, KeySquare } from "lucide-preact";
import { Theme, ThemeContext } from "../../theme-provider/theme.provider";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
