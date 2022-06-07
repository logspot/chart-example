import axios from "axios";
import React, { useEffect, useState } from "react";
import { Area, ComposedChart, Line } from "recharts";

const Chart = ({ data }) => {
  return (
    <ComposedChart width={500} height={300} data={data}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F64900" stopOpacity={0.7} />
          <stop offset="95%" stopColor="#F64900" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <Line
        type="monotone"
        unit="M"
        strokeLinecap="round"
        strokeWidth={1}
        dataKey="count"
        stroke="#F64900"
        dot={false}
        legendType="none"
      />
      <Area
        type="monotone"
        dataKey="count"
        stroke={false}
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ComposedChart>
  );
};

export default function Home({ data, count }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  }

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <label style={{ fontWeight: "bold" }}>Pageviews</label>
      <label style={{ fontWeight: "bold" }}>{count}</label>
      <Chart
        data={data.length ? [{ day: "2022-06-06", count: 0 }, ...data] : []}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const params = {
    // event_name: "User Login"
    // start_date: "2022-06-01",
  };
  const {
    data: { data },
  } = await axios.post(
    "https://api.logspot.io/analytics/count-events-running-total-per-day",
    params,
    {
      headers: {
        "x-logspot-sk": process.env.LOGSPOT_SECRET_KEY,
      },
    }
  );
  const {
    data: { data: count },
  } = await axios.post(
    "https://api.logspot.io/analytics/count-events",
    params,
    {
      headers: {
        "x-logspot-sk": process.env.LOGSPOT_SECRET_KEY,
      },
    }
  );
  return {
    props: { data, count },
  };
}
