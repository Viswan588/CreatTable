import { BrowserRouter } from 'react-router-dom';
import Routing from "./Routes/Routing";


function App() {
  
  return (
    <div>
			<BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;
