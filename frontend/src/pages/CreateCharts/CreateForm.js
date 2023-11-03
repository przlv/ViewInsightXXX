import 'reactjs-popup/dist/index.css';
import './CreateForm.css'
import {LinearCreate} from "./LinearCreate";
import {BarCreate} from "./BarCreate";
import {useLocation} from "react-router-dom";
import {PieCreate} from "./PieCreate";
import {RadarCreate} from "./RadarCreate";
import {ScatterCreate} from "./ScatterCreate";
import {MatrixScatterCreate} from "./MatrixScatterCreate";
import {MixCreate} from "./MixCreate";

export default function CreateForm() {
    const location = useLocation();
    const selectedGraph = location.state.selectedGraph;

    const graphComponents = {
        1: <LinearCreate />,
        2: <BarCreate />,
        3: <PieCreate />,
        5: <MixCreate />,
        7: <RadarCreate />,
        8: <ScatterCreate />,
        9: <MatrixScatterCreate />
    };

    const selectedComponent = graphComponents[selectedGraph];

    return selectedComponent || null;
}