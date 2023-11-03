import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush} from 'recharts';
import { GetDataFromServerContext }  from '../../utils/getDataFromServer'
import React, {useEffect, useState, useMemo} from 'react';


export default function LinearChart (props) {
    const nameDataset = props.nameDataset
    const [data, setData] = useState([]);
    const sendData = useMemo(() => ({
        metrics: props.metrics,
        dimensions: props.dimensions,
        date_start: props.date_start,
        date_end: props.date_end,
        x: props.x,
        aggregateTime: props.aggregateTime,
        date_column: props.date_column,
    }), [props.metrics, props.dimensions, props.date_start, props.date_end, props.x, props.aggregateTime, props.date_column]);

    useEffect(() => {
        GetDataFromServerContext(setData, `/get/dataGraph/linear/${nameDataset}`, sendData);
    }, [nameDataset, sendData, props.typeLinear]);

    const lineColors = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658"];
    const numberAxisY = {
        0: 'left',
        1: 'right'
    }
    return (
        <div>
            <LineChart
                width={props.chartSize.width}
                height={props.chartSize.height}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                {props.isChecked ? (
                    <>
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                    </>
                ) : (
                    <YAxis />
                )}
                <Tooltip />
                <Legend />
                <Brush dataKey="x" stroke="#8884d8" />
                {props.isChecked
                    ? props.metrics.map((metric, index) => (
                        <Line
                            key={metric}
                            type={props.typeLinear}
                            yAxisId={numberAxisY[index]}
                            dataKey={metric}
                            stroke={lineColors[index % lineColors.length]}
                        />
                    ))
                    : props.metrics.map((metric, index) => (
                        <Line
                            key={metric}
                            type={props.typeLinear}
                            dataKey={metric}
                            stroke={lineColors[index % lineColors.length]}
                        />
                    ))}
            </LineChart>
        </div>
    )
}
