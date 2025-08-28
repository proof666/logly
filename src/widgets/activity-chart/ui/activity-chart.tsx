import { Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface ActivityChartProps {
    data: Array<{ date: string; count: number }>;
}

export const ActivityChart: FC<ActivityChartProps> = ({ data }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Activity</Typography>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
