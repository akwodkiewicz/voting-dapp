import React, { Component } from "react";
import { Cell, Pie, PieChart, Legend, Sector, Tooltip } from "recharts";
import { Voting } from "../../utils/types";

interface IResultsPieChartProps {
  results: string[];
  voting: Voting;
}

interface IResultsPieChartState {
  chartData: any[];
  label: React.SVGProps<SVGAElement>;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default class ResultsModal extends Component<IResultsPieChartProps, IResultsPieChartState> {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      label: null,
    };
  }

  public componentDidMount = () => {
    const chartData = [];
    //const answers = this.props.voting.info.answers;
    //const results = this.props.results.map((result) => parseInt(result, 10));

    //for (let index = 0; index < answers.length; index++) {
    //const singleOption = { name: answers[index], value: results[index] };
    //}

    this.setState({
      chartData,
    });
  };

  public render() {
    const data = [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
    ];
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <PieChart width={800} height={400}>
        <Pie data={data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label={renderCustomizedLabel} />
        {/* {data.map((
          _entry, // tslint:disable-line
          index
        ) => (
          <Cell fill={COLORS[index % COLORS.length]} />
        ))} */}
        <Tooltip />
      </PieChart>
    );
  }
}
