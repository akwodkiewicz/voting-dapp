import React, { Component } from "react";
import { Cell, Pie, PieChart, Legend, ResponsiveContainer, Sector, Tooltip } from "recharts";
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

export default class ResultsPieChart extends Component<IResultsPieChartProps, IResultsPieChartState> {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      label: null,
    };
  }

  public componentDidMount = () => {
    const chartData = [];
    const answers = this.props.voting.info.answers;
    const results = this.props.results.map((result) => parseInt(result, 10));

    for (let index = 0; index < answers.length; index++) {
      const singleOption = { name: answers[index], value: results[index] };
      chartData.push(singleOption);
    }

    this.setState({
      chartData,
    });
  };

  public render() {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const data = [
      { name: "Group A", value: 0 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
    ];
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={this.state.chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={renderCustomizedLabel}
            fill="#8884d8"
          >
            {data.map((_entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
