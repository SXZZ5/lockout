import Homepage from "./homepage"
import Logsign from "./Logsign"

function App() {
    const style = {
        "display": "flex",
        "justifyContent": "space-around"
    }
    return <div id="APP" style={style}>
        <Logsign></Logsign>
        <Homepage></Homepage>
    </div>
}

export default App
