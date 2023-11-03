import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { GetDataFromServerContext }  from '../../utils/getDataFromServer'
import React, {useEffect, useState, useMemo} from 'react';
import './MatrixScatter.css'


export default function MatrixScatterChart(props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metrics: props.metrics,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        date_column: props.date_column
    }), [props.metrics, props.dimensions, props.date_start, props.date_end, props.date_column])
    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/matrixScatter/${nameDataset}`, sendData);
    }, [nameDataset, sendData]);

    // const lineColors = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"];
    const CustomDot = (props) => {
        const { cx, cy } = props;

        return (
            <circle cx={cx} cy={cy} r={2} fill="#8884d8" /> // Здесь устанавливаем желаемый размер точек
        );
    };

    return (
        <div className="matrixChart">
            {
                Object.keys(data).map((key, index) => {
                    const dataset = data[key];
                    const [graph_1, graph_2] = key.split('-');
                    return (
                        <div key={index} className="chartWrapper">
                            <ResponsiveContainer width={props.chartSize.width / props.metrics.length} height={300}>
                                <ScatterChart>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="x" name={graph_1} label={{ value: graph_1, dy: 12 }} />
                                    <YAxis type="number" dataKey="y" name={graph_2} label={{ value: graph_2, angle: -90, position: 'insideLeft', dy: 50 }} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name={nameDataset} data={dataset} fill={'#8884d8'} shape={<CustomDot />} />
                                    <Legend />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })
            }
        </div>
    )
}
