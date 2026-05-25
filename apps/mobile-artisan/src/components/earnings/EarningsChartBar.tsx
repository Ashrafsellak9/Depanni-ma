import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface EarningsChartBarProps {
  data: { date: string; amount: number }[];
  period: 7 | 30 | 90;
}

export function EarningsChartBar({ data, period }: EarningsChartBarProps) {
  const width = Dimensions.get("window").width - 48;
  const slice = data.slice(-period);

  if (slice.length === 0) {
    return <Text style={styles.empty}>Pas encore de revenus sur cette période</Text>;
  }

  const step = slice.length > 7 ? Math.ceil(slice.length / 7) : 1;
  const filtered = slice.filter((_, i) => i % step === 0 || i === slice.length - 1);
  const labels = filtered.map((d) => {
    const parts = d.date.split("-");
    return `${parts[2]}/${parts[1]}`;
  });
  const amounts = filtered.map((d) => Math.max(0, d.amount));

  return (
    <BarChart
      data={{
        labels,
        datasets: [{ data: amounts.length ? amounts : [0] }],
      }}
      width={width}
      height={200}
      yAxisLabel=""
      yAxisSuffix=" MAD"
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(21, 128, 61, ${opacity})`,
        labelColor: () => "#64748b",
        barPercentage: 0.55,
      }}
      style={styles.chart}
      fromZero
    />
  );
}

const styles = StyleSheet.create({
  chart: { borderRadius: 12, marginVertical: 8 },
  empty: { textAlign: "center", color: "#94a3b8", padding: 24 },
});
