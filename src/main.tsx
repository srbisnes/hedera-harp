import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('HARP root element was not found.');
}

createRoot(root).render(<App />);
