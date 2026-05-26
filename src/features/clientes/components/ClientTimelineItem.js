import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { formatHistoryDate } from "../services/clientHistoryApi";

export function ClientTimelineItem({ item }) {
  const config = getConfig(item?.type);

  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={[styles.iconBox, { backgroundColor: config.color }]}>
          <Feather name={config.icon} size={17} color="#FFFFFF" />
        </View>
        <View style={styles.line} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.status, { color: config.color }]}>
            {item.status}
          </Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{formatHistoryDate(item.date)}</Text>
      </View>
    </View>
  );
}

function getConfig(type) {
  if (type === "equipo") {
    return {
      icon: "monitor",
      color: colors.primary,
    };
  }

  return {
    icon: "tool",
    color: "#0F766E",
  };
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 14,
  },
  timeline: {
    alignItems: "center",
    marginRight: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  title: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  status: {
    fontSize: 12,
    fontWeight: "900",
  },
  description: {
    marginTop: 5,
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 18,
  },
  date: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
});