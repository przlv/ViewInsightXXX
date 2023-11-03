import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip} from 'recharts';
import React, {useEffect, useState, useMemo} from "react";
import {GetDataFromServerContext} from "../../utils/getDataFromServer";


export default function RadarChar(props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metrics: props.metrics,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        aggregateFunc: props.aggregateFunc,
        date_column: props.date_column,
    }), [props.metrics, props.dimensions, props.date_start, props.date_end, props.aggregateFunc, props.date_column]);

    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/radar/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <RadarChart cx={300} cy={250} outerRadius={150} width={props.chartSize.width} height={props.chartSize.height} data={data}>
            <PolarGrid  radialLines/>
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} />
            <Radar name={nameDataset} dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
        </RadarChart>
    );
}
