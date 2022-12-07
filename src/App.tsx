import { ExportToExcel } from "./components";
import { TableDownload } from "./components";
import "antd/dist/reset.css";
function App() {
    return (
        <div>
            <TableDownload></TableDownload>
            <ExportToExcel></ExportToExcel>
        </div>
    );
}

export default App;
