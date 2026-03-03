import { createRoot } from "react-dom/client"
import "./index.css"
import Home from "./Home.jsx"

const root = createRoot(document.querySelector("#root"))
root.render(<Home />)

