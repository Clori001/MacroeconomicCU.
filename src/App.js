import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Sliders, TrendingUp, AlertCircle } from "lucide-react";

const PolicySimulator = () => {
  // Policy parameters
  const [fiscalStimulus, setFiscalStimulus] = useState(3.0);
  const [interestRateCut, setInterestRateCut] = useState(0.2);
  const [consumptionSubsidy, setConsumptionSubsidy] = useState(1.0);
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕大小
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Calculate outcomes
  const calculateOutcomes = () => {
    const baseGDP = 121;
    const potentialGDP = 126;

    const fiscalImpact = fiscalStimulus * 2.5;
    const monetaryImpact = interestRateCut * 10 * 0.8;
    const consumptionImpact = consumptionSubsidy * 3.0;

    const totalGDPIncrease = fiscalImpact + monetaryImpact + consumptionImpact;
    const newGDP = Math.min(baseGDP + totalGDPIncrease, potentialGDP + 2);

    const baseUnemployment = 5.8;
    const gdpGrowthRate = ((newGDP - baseGDP) / baseGDP) * 100;
    const unemploymentReduction = gdpGrowthRate * 0.5;
    const newUnemployment = Math.max(
      baseUnemployment - unemploymentReduction,
      4.2
    );

    const outputGap = ((newGDP - potentialGDP) / potentialGDP) * 100;
    const baseInflation = 0.5;
    const newInflation = Math.max(baseInflation + outputGap * 0.3, -0.5);

    const baseDebt = 91;
    const debtIncrease = ((fiscalStimulus + consumptionSubsidy) / newGDP) * 100;
    const newDebt = baseDebt + debtIncrease;

    const baseConfidence = 87;
    const confidenceBoost = Math.min(
      fiscalImpact * 2 + monetaryImpact * 1.5 + consumptionImpact * 3,
      40
    );
    const newConfidence = Math.min(baseConfidence + confidenceBoost, 140);

    return {
      gdp: newGDP,
      gdpGrowth: gdpGrowthRate,
      unemployment: newUnemployment,
      inflation: newInflation,
      debt: newDebt,
      confidence: newConfidence,
      outputGap: outputGap,
      fiscalImpact,
      monetaryImpact,
      consumptionImpact,
    };
  };

  const outcomes = calculateOutcomes();

  // Historical + Projected Data
  const timeSeriesData = [
    { year: "2021", gdp: 8.4, unemployment: 5.1, inflation: 0.9, debt: 68 },
    { year: "2022", gdp: 3.0, unemployment: 5.5, inflation: 2.0, debt: 77 },
    { year: "2023", gdp: 5.2, unemployment: 5.2, inflation: 0.2, debt: 83 },
    { year: "2024", gdp: 4.8, unemployment: 5.8, inflation: 0.5, debt: 91 },
    {
      year: "2025",
      gdp: outcomes.gdpGrowth,
      unemployment: outcomes.unemployment,
      inflation: outcomes.inflation,
      debt: outcomes.debt,
    },
  ];

  // Policy Breakdown
  const policyBreakdown = [
    { name: "Fiscal Stimulus", value: outcomes.fiscalImpact, color: "#2E86AB" },
    {
      name: "Monetary Policy",
      value: outcomes.monetaryImpact,
      color: "#A23B72",
    },
    {
      name: "Consumption Subsidy",
      value: outcomes.consumptionImpact,
      color: "#F18F01",
    },
  ];

  // Risk Assessment
  const getRiskLevel = () => {
    if (outcomes.debt > 110)
      return {
        level: "HIGH",
        color: "#E71D36",
        message: "Debt sustainability concerns",
      };
    if (outcomes.inflation > 3)
      return { level: "HIGH", color: "#E71D36", message: "Overheating risk" };
    if (outcomes.debt > 100)
      return {
        level: "MEDIUM",
        color: "#F18F01",
        message: "Moderate fiscal risk",
      };
    if (outcomes.gdpGrowth < 4)
      return {
        level: "MEDIUM",
        color: "#F18F01",
        message: "Insufficient stimulus",
      };
    return { level: "LOW", color: "#2E86AB", message: "Balanced policy mix" };
  };

  const risk = getRiskLevel();

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #1A3A5F 0%, #2E86AB 50%, #6BB2CC 100%)",
        minHeight: "100vh",
        padding: isMobile ? "12px" : "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "100%", margin: "0 auto", overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(26, 58, 95, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(107, 178, 204, 0.3)",
            padding: isMobile ? "20px" : "28px",
            marginBottom: isMobile ? "16px" : "24px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #2E86AB, #6BB2CC)",
                padding: isMobile ? "8px" : "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sliders size={isMobile ? 20 : 24} color="white" />
            </div>
            <h1
              style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #fff, #6BB2CC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                lineHeight: "1.2",
              }}
            >
              China 2025 Policy Simulator
            </h1>
          </div>
          <p
            style={{
              color: "#E8F4F8",
              fontSize: isMobile ? "14px" : "18px",
              margin: "8px 0 0 0",
              lineHeight: "1.5",
            }}
          >
            Interactive macroeconomic policy simulator based on DSGE modeling.
            Adjust policy levers to see their impact on key economic indicators.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
          {/* Policy Controls */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            {/* Fiscal Policy */}
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "600",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                Fiscal Stimulus
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#E8F4F8",
                    fontSize: isMobile ? "14px" : "16px",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  <span>Spending Package</span>
                  <span style={{ color: "white", fontWeight: "600" }}>
                    ¥{fiscalStimulus}T
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={fiscalStimulus}
                  onChange={(e) =>
                    setFiscalStimulus(parseFloat(e.target.value))
                  }
                  style={{
                    width: "100%",
                    height: isMobile ? "6px" : "8px",
                    borderRadius: "4px",
                    background: "linear-gradient(90deg, #2E86AB, #6BB2CC)",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#A8D4E6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginTop: isMobile ? "4px" : "8px",
                  }}
                >
                  <span>¥0T</span>
                  <span>¥6T</span>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(46, 134, 171, 0.3)",
                  border: "1px solid rgba(46, 134, 171, 0.6)",
                  borderRadius: "10px",
                  padding: isMobile ? "12px" : "16px",
                }}
              >
                <div
                  style={{
                    color: "#A8D4E6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginBottom: "6px",
                  }}
                >
                  ESTIMATED IMPACT
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: "600",
                  }}
                >
                  +{outcomes.fiscalImpact.toFixed(1)}T GDP
                </div>
                <div style={{ color: "#A8D4E6", fontSize: isMobile ? "12px" : "14px" }}>
                  Multiplier: 2.5x
                </div>
              </div>
            </div>

            {/* Monetary Policy */}
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(162, 59, 114, 0.4)",
                padding: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "600",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                Monetary Policy
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#E8F4F8",
                    fontSize: isMobile ? "14px" : "16px",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  <span>Interest Rate Cut</span>
                  <span style={{ color: "white", fontWeight: "600" }}>
                    {(interestRateCut * 100).toFixed(0)}bp
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.1"
                  value={interestRateCut}
                  onChange={(e) =>
                    setInterestRateCut(parseFloat(e.target.value))
                  }
                  style={{
                    width: "100%",
                    height: isMobile ? "6px" : "8px",
                    borderRadius: "4px",
                    background: "linear-gradient(90deg, #A23B72, #C86B98)",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#E8C4D6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginTop: isMobile ? "4px" : "8px",
                  }}
                >
                  <span>0bp</span>
                  <span>100bp</span>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(162, 59, 114, 0.3)",
                  border: "1px solid rgba(162, 59, 114, 0.6)",
                  borderRadius: "10px",
                  padding: isMobile ? "12px" : "16px",
                }}
              >
                <div
                  style={{
                    color: "#E8C4D6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginBottom: "6px",
                  }}
                >
                  ESTIMATED IMPACT
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: "600",
                  }}
                >
                  +{outcomes.monetaryImpact.toFixed(1)}T GDP
                </div>
                <div style={{ color: "#E8C4D6", fontSize: isMobile ? "12px" : "14px" }}>
                  Limited transmission
                </div>
              </div>
            </div>

            {/* Consumption Subsidy */}
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(241, 143, 1, 0.4)",
                padding: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "600",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                Consumption Subsidy
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#E8F4F8",
                    fontSize: isMobile ? "14px" : "16px",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  <span>Direct Transfers</span>
                  <span style={{ color: "white", fontWeight: "600" }}>
                    ¥{consumptionSubsidy}T
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.25"
                  value={consumptionSubsidy}
                  onChange={(e) =>
                    setConsumptionSubsidy(parseFloat(e.target.value))
                  }
                  style={{
                    width: "100%",
                    height: isMobile ? "6px" : "8px",
                    borderRadius: "4px",
                    background: "linear-gradient(90deg, #F18F01, #F9B241)",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#F9D8A6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginTop: isMobile ? "4px" : "8px",
                  }}
                >
                  <span>¥0T</span>
                  <span>¥3T</span>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(241, 143, 1, 0.3)",
                  border: "1px solid rgba(241, 143, 1, 0.6)",
                  borderRadius: "10px",
                  padding: isMobile ? "12px" : "16px",
                }}
              >
                <div
                  style={{
                    color: "#F9D8A6",
                    fontSize: isMobile ? "12px" : "14px",
                    marginBottom: "6px",
                  }}
                >
                  ESTIMATED IMPACT
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: "600",
                  }}
                >
                  +{outcomes.consumptionImpact.toFixed(1)}T GDP
                </div>
                <div style={{ color: "#F9D8A6", fontSize: isMobile ? "12px" : "14px" }}>
                  High MPC effect
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(2, 1fr)",
              gap: isMobile ? "12px" : "20px",
            }}
          >
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#A8D4E6",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "8px" : "12px",
                }}
              >
                GDP GROWTH
              </div>
              <div
                style={{
                  color:
                    outcomes.gdpGrowth >= 5.5
                      ? "#2E86AB"
                      : outcomes.gdpGrowth >= 4.5
                      ? "#F18F01"
                      : "#E71D36",
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "4px" : "8px",
                }}
              >
                {outcomes.gdpGrowth.toFixed(1)}%
              </div>
              <div style={{ color: "#A8D4E6", fontSize: isMobile ? "12px" : "14px" }}>
                Target: 5.5%
              </div>
            </div>

            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#A8D4E6",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "8px" : "12px",
                }}
              >
                UNEMPLOYMENT
              </div>
              <div
                style={{
                  color:
                    outcomes.unemployment <= 5.0
                      ? "#2E86AB"
                      : outcomes.unemployment <= 5.5
                      ? "#F18F01"
                      : "#E71D36",
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "4px" : "8px",
                }}
              >
                {outcomes.unemployment.toFixed(1)}%
              </div>
              <div style={{ color: "#A8D4E6", fontSize: isMobile ? "12px" : "14px" }}>
                Target: ≤5.0%
              </div>
            </div>

            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#A8D4E6",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "8px" : "12px",
                }}
              >
                INFLATION (CPI)
              </div>
              <div
                style={{
                  color:
                    outcomes.inflation >= 1 && outcomes.inflation <= 3
                      ? "#2E86AB"
                      : "#F18F01",
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "4px" : "8px",
                }}
              >
                {outcomes.inflation.toFixed(1)}%
              </div>
              <div style={{ color: "#A8D4E6", fontSize: isMobile ? "12px" : "14px" }}>
                Target: 1-3%
              </div>
            </div>

            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#A8D4E6",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "8px" : "12px",
                }}
              >
                GOVT DEBT/GDP
              </div>
              <div
                style={{
                  color:
                    outcomes.debt <= 100
                      ? "#2E86AB"
                      : outcomes.debt <= 110
                      ? "#F18F01"
                      : "#E71D36",
                  fontSize: isMobile ? "20px" : "28px",
                  fontWeight: "700",
                  marginBottom: isMobile ? "4px" : "8px",
                }}
              >
                {outcomes.debt.toFixed(0)}%
              </div>
              <div style={{ color: "#A8D4E6", fontSize: isMobile ? "12px" : "14px" }}>
                Threshold: 100%
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div
            style={{
              background: `${risk.color}20`,
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              border: `1px solid ${risk.color}60`,
              padding: isMobile ? "16px" : "24px",
              marginBottom: isMobile ? "16px" : "24px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AlertCircle size={isMobile ? 20 : 24} color={risk.color} />
              <div>
                <div
                  style={{
                    color: "white",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                  }}
                >
                  Risk Level: {risk.level}
                </div>
                <div style={{ color: risk.color, fontSize: isMobile ? "14px" : "16px" }}>
                  {risk.message}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            {/* Time Series Chart */}
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "600",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                Macroeconomic Trajectory (2021-2025)
              </h3>
              <div style={{ width: "100%", height: isMobile ? "250px" : "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E86AB" />
                    <XAxis
                      dataKey="year"
                      stroke="#A8D4E6"
                      tick={{ fill: "#A8D4E6", fontSize: isMobile ? 12 : 14 }}
                    />
                    <YAxis
                      stroke="#A8D4E6"
                      tick={{ fill: "#A8D4E6", fontSize: isMobile ? 12 : 14 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A3A5F",
                        border: "1px solid #2E86AB",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: isMobile ? "12px" : "14px", color: "#A8D4E6" }} />
                    <Line
                      type="monotone"
                      dataKey="gdp"
                      stroke="#2E86AB"
                      strokeWidth={isMobile ? 2 : 3}
                      dot={{ fill: "#2E86AB", strokeWidth: 2, r: isMobile ? 3 : 4 }}
                      name="GDP Growth (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="unemployment"
                      stroke="#E71D36"
                      strokeWidth={isMobile ? 2 : 3}
                      dot={{ fill: "#E71D36", strokeWidth: 2, r: isMobile ? 3 : 4 }}
                      name="Unemployment (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="inflation"
                      stroke="#F18F01"
                      strokeWidth={isMobile ? 2 : 3}
                      dot={{ fill: "#F18F01", strokeWidth: 2, r: isMobile ? 3 : 4 }}
                      name="Inflation (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Policy Contribution Chart */}
            <div
              style={{
                background: "rgba(26, 58, 95, 0.8)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(46, 134, 171, 0.4)",
                padding: isMobile ? "16px" : "24px",
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "600",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                Policy Contribution to GDP Growth
              </h3>
              <div style={{ width: "100%", height: isMobile ? "250px" : "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E86AB" />
                    <XAxis
                      dataKey="name"
                      stroke="#A8D4E6"
                      tick={{ fill: "#A8D4E6", fontSize: isMobile ? 12 : 14 }}
                    />
                    <YAxis
                      stroke="#A8D4E6"
                      tick={{ fill: "#A8D4E6", fontSize: isMobile ? 12 : 14 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A3A5F",
                        border: "1px solid #2E86AB",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {policyBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: "center", marginTop: isMobile ? "12px" : "20px" }}>
                <div style={{ color: "#A8D4E6", fontSize: isMobile ? "14px" : "16px" }}>
                  Total GDP Impact
                </div>
                <div
                  style={{
                    color: "white",
                    fontSize: isMobile ? "20px" : "28px",
                    fontWeight: "700",
                  }}
                >
                  +
                  {(
                    outcomes.fiscalImpact +
                    outcomes.monetaryImpact +
                    outcomes.consumptionImpact
                  ).toFixed(1)}{" "}
                  Trillion ¥
                </div>
              </div>
            </div>
          </div>

          {/* A: Optimal Policy Recommendation */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(46, 134, 171, 0.3) 0%, rgba(241, 143, 1, 0.2) 100%)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              border: "1px solid rgba(46, 134, 171, 0.4)",
              padding: isMobile ? "16px" : "24px",
              marginBottom: isMobile ? "16px" : "24px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? "12px" : "16px" }}
            >
              <TrendingUp
                size={isMobile ? 20 : 24}
                color="#2E86AB"
                style={{ marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: "600",
                    marginBottom: isMobile ? "8px" : "12px",
                  }}
                >
                  Optimal Policy Recommendation
                </h3>
                <p
                  style={{
                    color: "#E8F4F8",
                    fontSize: isMobile ? "14px" : "16px",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  Based on current simulation:{" "}
                  <strong style={{ color: "white" }}>
                    Fiscal Stimulus = ¥{fiscalStimulus}T, Rate Cut ={" "}
                    {(interestRateCut * 100).toFixed(0)}bp, Consumption Subsidy
                    = ¥{consumptionSubsidy}T
                  </strong>{" "}
                  generates {outcomes.gdpGrowth.toFixed(1)}% GDP growth with{" "}
                  {outcomes.unemployment.toFixed(1)}% unemployment and{" "}
                  {outcomes.debt.toFixed(0)}% debt-to-GDP ratio.
                  {outcomes.gdpGrowth >= 5.5 && outcomes.debt <= 100
                    ? " ✅ This configuration meets all policy objectives effectively."
                    : " ⚠️ Consider adjusting parameters to better balance growth and fiscal sustainability."}
                </p>
              </div>
            </div>
          </div>

          {/* B: Model Specifications & Assumptions */}
          <div
            style={{
              background: "rgba(26, 58, 95, 0.8)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              border: "1px solid rgba(46, 134, 171, 0.4)",
              padding: isMobile ? "16px" : "24px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "600",
                marginBottom: isMobile ? "12px" : "16px",
              }}
            >
              Model Specifications & Assumptions
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: isMobile ? "16px" : "20px",
              }}
            >
              <div
                style={{
                  color: "#E8F4F8",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: "1.5",
                }}
              >
                <div>
                  <strong style={{ color: "white" }}>Fiscal Multiplier:</strong>{" "}
                  2.5 (infrastructure-weighted)
                </div>
                <div>
                  <strong style={{ color: "white" }}>
                    Consumption Multiplier:
                  </strong>{" "}
                  3.0 (MPC = 0.75 for low-income households)
                </div>
                <div>
                  <strong style={{ color: "white" }}>
                    Monetary Effectiveness:
                  </strong>{" "}
                  0.8 (adjusted for liquidity trap conditions)
                </div>
              </div>
              <div
                style={{
                  color: "#E8F4F8",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: "1.5",
                }}
              >
                <div>
                  <strong style={{ color: "white" }}>
                    Okun's Law Coefficient:
                  </strong>{" "}
                  -0.5
                </div>
                <div>
                  <strong style={{ color: "white" }}>
                    Phillips Curve Slope:
                  </strong>{" "}
                  0.3
                </div>
                <div>
                  <strong style={{ color: "white" }}>Potential GDP:</strong>{" "}
                  ¥126 trillion (2024 baseline)
                </div>
              </div>
            </div>
            <p
              style={{
                color: "#A8D4E6",
                fontSize: isMobile ? "12px" : "14px",
                marginTop: isMobile ? "16px" : "20px",
                lineHeight: "1.5",
              }}
            >
              Sources: IMF (2024), National Bureau of Statistics, Asian
              Development Bank. Model calibrated using China-specific
              parameters.
            </p>
          </div>

          {/* 页脚署名 */}
          <div
            style={{
              textAlign: "center",
              color: "#A8D4E6",
              padding: "20px 0",
              fontSize: isMobile ? "12px" : "14px",
              marginTop: "20px",
            }}
          >
            Developed by Caro (SHAOYANQI) | Macroeconomic Policy Simulator 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySimulator;
