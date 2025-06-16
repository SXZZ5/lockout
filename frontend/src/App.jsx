import { Router, Route } from '@solidjs/router'
import Landing from './pages/Landing'
import Homepage from './pages/Homepage'

function App() {
  return (
    <Router>
        <Route path="/" component={Landing}/>
        <Route path="/home" component={Homepage}/>
    </Router>
  )
}

export default App
