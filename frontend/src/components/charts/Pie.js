import { PieChart, Pie, Tooltip, Cell, Legend} from 'recharts';
import React, {useEffect, useState, useMemo} from "react";
import {GetDataFromServerContext} from "../../utils/getDataFromServer";


export default function PieChar(props) {
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
        GetDataFromServerContext(setData, `/get/dataGraph/pie/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <PieChart width={props.chartSize.width}
                  height={props.chartSize.height}>
            <Pie
                dataKey="value"
                startAngle={360}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                labelLine={false}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Legend />
            <Tooltip />
        </PieChart>
    );
}
