import { Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
} from "recharts";
type Props = {
    data: Array<{ date: string; count: number }>;
    goalLine?: number;
};

export function DailyChart({ data, goalLine }: Props) {
    const theme = useTheme();
    return (
        <Card>
            <CardContent style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" hide={data.length > 20} />
                        <YAxis allowDecimals={false} width={32} />
                        <Tooltip
                            cursor={{ fill: theme.palette.primary.main, opacity: 0.1 }}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                color: theme.palette.text.primary,
                                boxShadow: theme.shadows[3],
                            }}
                            itemStyle={{ color: theme.palette.text.primary }}
                            labelStyle={{ color: theme.palette.text.secondary }}
                        />
                        {typeof goalLine === "number" ? (
                            <ReferenceLine
                                y={goalLine}
                                stroke={theme.palette.text.secondary}
                                strokeDasharray="8 8"
                                label={{
                                    value: "Goal",
                                    position: "top",
                                    fill: theme.palette.text.secondary,
                                    fontSize: 16,
                                }}
                            />
                        ) : null}
                        <Bar
                            dataKey="count"
                            fill={theme.palette.primary.main}
                            background={{
                                fill: theme.palette.action.hover,
                            }}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
