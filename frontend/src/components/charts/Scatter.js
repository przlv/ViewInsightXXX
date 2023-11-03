import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { GetDataFromServerContext }  from '../../utils/getDataFromServer'
import React, {useEffect, useState, useMemo} from 'react';


export default function MyScatterChart(props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metrics: props.metrics,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        x: props.x,
        date_column: props.date_column,
    }), [props.metrics, props.dimensions, props.date_start, props.date_end, props.x, props.date_column]);

    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/scatter/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    const lineColors = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"];
    return (
        <div>
            <ScatterChart
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
                width={props.chartSize.width}
                height={props.chartSize.height}
            >
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name={props.x} />
                <YAxis type="number" dataKey="y" name={"Показатель"} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                {data.map((dataset, index) => (
                    <Scatter key={index} name={props.metrics[index]} data={dataset} fill={lineColors[index % lineColors.length]} />
                ))}
                <Legend />
            </ScatterChart>
        </div>
    )
}
