import React, {useEffect, useState, useMemo} from 'react';
import {
    BarChart,
    Bar,
    Brush,
    ReferenceLine,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import {GetDataFromServerContext} from "../../utils/getDataFromServer";

export default function BarChar(props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metrics: props.metrics,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        x: props.x
    }), [props.metrics, props.dimensions, props.date_start, props.date_end, props.x]);

    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/bar/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    const lineColors = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"];

    return (
        <div>
            <BarChart
                width={props.chartSize.width}
                height={props.chartSize.height}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                <ReferenceLine y={0} stroke="#000" />
                <Brush dataKey="x" height={30} stroke="#8884d8" />
                {props.metrics.map((metric,index) => (
                    <Bar key={metric} type="monotone" dataKey={metric} fill={lineColors[index % lineColors.length]} />
                ))}
            </BarChart>
        </div>
    )
}
