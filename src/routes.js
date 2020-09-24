// Import components
import Tesseract from "./components/Tesseract";
import GoogleVision from "./components/GoogleVision";
import ECodeScanner from "./components/ECodeScanner";
import ActionSheet from "./components/ActionSheet/Demo";
import HelloWorld from "./components/HelloWorld";
import HelloReactSpring from "./components/HelloReactSpring";

// Map components to routes
const routes = [
  { path: "/", Component: HelloWorld },
  { path: "/tesseract", Component: Tesseract },
  { path: "/google-vision", Component: GoogleVision },
  { path: "/e-code-scanner", Component: ECodeScanner },
  { path: "/action-sheet", Component: ActionSheet },
  { path: "/hello-react-spring", Component: HelloReactSpring }
];

export default routes;
