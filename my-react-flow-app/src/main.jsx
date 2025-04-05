import { createRoot } from 'react-dom/client';
import App from './App';
import './xy-theme.css';

const root = createRoot(document.getElementById('app'));
root.render(<App />);