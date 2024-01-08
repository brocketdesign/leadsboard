import logo from './logo.svg';
import EmailFetcher from './components/EmailFetcher';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>Email Fetcher Application</h1>
      <EmailFetcher />
      {/* Other components or content */}
    </div>
  );
}

export default App;

