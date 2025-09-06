import { Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart, ChartsReferenceLine } from "@mui/x-charts";

type Props = {
    data: Array<{ date: string; count: number }>;
    goalLine?: number;
};

export function DailyChart({ data, goalLine }: Props) {
    const theme = useTheme();
    return (
        <Card>
            <CardContent style={{ height: 300 }}>
                <BarChart
                    dataset={data}
                    xAxis={[
                        {
                            scaleType: "band",
                            dataKey: "date",
                            tickLabelStyle: { fontSize: 12 },
                        },
                    ]}
                    yAxis={[
                        {
                            tickLabelStyle: { fontSize: 12 },
                        },
                    ]}
                    series={[
                        {
                            dataKey: "count",
                            color: theme.palette.primary.main,
                        },
                    ]}
                    height={300}
                    margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    grid={{ horizontal: true }}
                >
                    {typeof goalLine === "number" ? (
                        <ChartsReferenceLine
                            y={goalLine}
                            lineStyle={{
                                stroke: theme.palette.text.secondary,
                                strokeDasharray: "8 8",
                            }}
                            label="Goal"
                            labelStyle={{
                                fill: theme.palette.text.secondary,
                                fontSize: 16,
                            }}
                        />
                    ) : null}
                </BarChart>
            </CardContent>
        </Card>
    );
}
