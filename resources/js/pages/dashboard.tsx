import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    // Sample data for charts
    const lineChartData = [
        { name: 'Jan', users: 400, revenue: 2400 },
        { name: 'Feb', users: 520, revenue: 2210 },
        { name: 'Mar', users: 720, revenue: 2290 },
        { name: 'Apr', users: 800, revenue: 2000 },
        { name: 'May', users: 920, revenue: 2181 },
        { name: 'Jun', users: 1050, revenue: 2500 },
    ];

    const barChartData = [
        { name: 'Mon', sessions: 240 },
        { name: 'Tue', sessions: 380 },
        { name: 'Wed', sessions: 320 },
        { name: 'Thu', sessions: 420 },
        { name: 'Fri', sessions: 510 },
        { name: 'Sat', sessions: 480 },
        { name: 'Sun', sessions: 390 },
    ];

    const pieChartData = [
        { name: 'Desktop', value: 65 },
        { name: 'Mobile', value: 25 },
        { name: 'Tablet', value: 10 },
    ];

    const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back! Here's your activity overview.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Badge variant="secondary">+12%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +120 new users this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <Badge variant="secondary">+8%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231</div>
                            <p className="text-xs text-muted-foreground">
                                +5,231 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Badge variant="secondary">+5%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">523</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active users
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <Badge variant="secondary">+2%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12.5%</div>
                            <p className="text-xs text-muted-foreground">
                                Up from 10.5% last week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Line Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Users & Revenue Trend</CardTitle>
                                    <CardDescription>
                                        Monthly performance overview
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    Export
                                </Button>
                            </div>
                        </CardHeader>
                        <Separator className="mb-4" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-muted-foreground" />
                                    <YAxis className="text-muted-foreground" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Device Distribution</CardTitle>
                                <CardDescription>
                                    User access by device
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <Separator className="mb-4" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name} ${value}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Weekly Sessions</CardTitle>
                                <CardDescription>
                                    Daily active sessions this week
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                View Details
                            </Button>
                        </div>
                    </CardHeader>
                    <Separator className="mb-4" />
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" className="text-muted-foreground" />
                                <YAxis className="text-muted-foreground" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
