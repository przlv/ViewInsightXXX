import {
    Area,
    Bar,
    Brush,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {GetDataFromServerContext} from '../../utils/getDataFromServer'
import React, {useEffect, useMemo, useState} from 'react';

function getDarkerColor(color) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16); // Получаем красную компоненту
    const g = parseInt(hex.slice(2, 4), 16); // Получаем зеленую компоненту
    const b = parseInt(hex.slice(4, 6), 16); // Получаем синюю компоненту

    // Уменьшаем значения RGB для получения темнее оттененного цвета
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);

    // Преобразуем обратно в формат цвета
    return `#${darkerR.toString(16)}${darkerG.toString(16)}${darkerB.toString(16)}`;
}

export default function MixChart(props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metricsLinear: props.metricsLinear,
        metricsBar: props.metricsBar,
        metricsArea: props.metricsArea,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        x: props.x,
        date_column: props.date_column
    }), [props.metricsLinear, props.metricsBar, props.metricsArea, props.dimensions, props.date_start, props.date_end, props.x, props.date_column]);

    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/mixchart/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    const lineColorsLine = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"];
    const lineColorsBar = ["#ffa68e", "#33ff57", "#5733ff", "#ff3399"];
    const lineColorsArea = ["#33ff99", "#9966ff", "#ff9966", "#66ff99"];

    return (
        <div>
            <ResponsiveContainer width={props.chartSize.width} height={props.chartSize.height}>
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="x" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {props.metricsArea.map((metric, index) => {
                        return (
                            <Area key={index+metric} type="monotone" dataKey={metric} fill={lineColorsArea[index % lineColorsArea.length]} stroke={getDarkerColor(lineColorsArea[index % lineColorsArea.length])} />
                        )
                    })}
                    {props.metricsBar.map((metric, index) => {
                        return (
                            <Bar key={index+metric} dataKey={metric} fill={lineColorsBar[index % lineColorsBar.length]} />
                        )
                    })}
                    {props.metricsLinear.map((metric, index) => {
                        return (
                            <Line key={index+metric} type="monotone" dataKey={metric} stroke={lineColorsLine[index % lineColorsLine.length]} strokeWidth={2} />
                        )
                    })}
                    <Brush dataKey="x" height={30} stroke="#8884d8" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}
