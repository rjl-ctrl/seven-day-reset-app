import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Flame, Coffee, Beef, Moon, Utensils, Dumbbell, RotateCcw } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const rules = [
  "Protein first",
  "Low carb today",
  "Skipped bread, tortillas, rice, pasta, chips, sweets",
  "Night snack was planned, not random"
];

const meals = {
  meal1: ["Protein coffee + chicken", "3 eggs + chicken", "Oikos PRO + almonds"],
  midday: ["Skip if not hungry", "Protein shake", "Oikos PRO", "Chicken", "Small handful almonds"],
  dinner: ["Chicken + vegetables", "Baked hamburger lettuce wrap", "Double chicken fajitas, no tortillas/rice/beans"],
  night: ["No snack needed", "Oikos PRO", "Protein shake", "Chicken", "Small handful almonds"]
};

function CheckItem({ label, checked, onClick }) {
  return (
    <button onClick={onClick} className="check-item">
      {checked ? <CheckCircle2 className="icon dark" /> : <Circle className="icon muted" />}
      <span>{label}</span>
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function MealCard({ title, icon, options, selected, onSelect }) {
  return (
    <Card>
      <div className="card-title">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="option-grid">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`meal-option ${selected === option ? "selected" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [checks, setChecks] = useState(() => {
    const saved = localStorage.getItem("reset-checks");
    return saved ? JSON.parse(saved) : {};
  });

  const [choices, setChoices] = useState(() => {
    const saved = localStorage.getItem("reset-choices");
    return saved ? JSON.parse(saved) : {};
  });

  const dayKey = `day-${activeDay}`;
  const dayChecks = checks[dayKey] || {};
  const dayChoices = choices[dayKey] || {};

  const score = useMemo(() => {
    const ruleScore = rules.filter((rule) => dayChecks[rule]).length;
    const mealScore = ["meal1", "dinner", "night"].filter((key) => dayChoices[key]).length;
    return ruleScore + mealScore;
  }, [dayChecks, dayChoices]);

  useEffect(() => {
    localStorage.setItem("reset-checks", JSON.stringify(checks));
  }, [checks]);

  useEffect(() => {
    localStorage.setItem("reset-choices", JSON.stringify(choices));
  }, [choices]);

  const toggleRule = (rule) => {
    setChecks((prev) => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || {}), [rule]: !dayChecks[rule] }
    }));
  };

  const chooseMeal = (meal, choice) => {
    setChoices((prev) => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || {}), [meal]: choice }
    }));
  };

  const resetToday = () => {
    setChecks((prev) => ({ ...prev, [dayKey]: {} }));
    setChoices((prev) => ({ ...prev, [dayKey]: {} }));
  };

  return (
    <main className="app-shell">
      <div className="phone-width">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">7-Day Reset</p>
              <h1>Jump Start Diet</h1>
            </div>
            <Flame className="hero-icon" />
          </div>
          <p className="hero-copy">Protein first. Low carb. No measuring. One planned night snack only.</p>
          <div className="score-box">
            <div className="score-row">
              <span>Today’s reset score</span>
              <strong>{score}/7</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(score / 7) * 100}%` }} />
            </div>
          </div>
        </motion.section>

        <nav className="day-tabs" aria-label="Select day">
          {days.map((day, index) => (
            <button key={day} onClick={() => setActiveDay(index)} className={activeDay === index ? "active" : ""}>
              {day}
            </button>
          ))}
        </nav>

        <Card>
          <h2>Daily Rules</h2>
          <div className="rule-list">
            {rules.map((rule) => (
              <CheckItem key={rule} label={rule} checked={!!dayChecks[rule]} onClick={() => toggleRule(rule)} />
            ))}
          </div>
        </Card>

        <div className="meal-stack">
          <MealCard title="Meal 1" icon={<Coffee className="small-icon" />} options={meals.meal1} selected={dayChoices.meal1} onSelect={(choice) => chooseMeal("meal1", choice)} />
          <MealCard title="Midday, only if hungry" icon={<Utensils className="small-icon" />} options={meals.midday} selected={dayChoices.midday} onSelect={(choice) => chooseMeal("midday", choice)} />
          <MealCard title="Dinner" icon={<Beef className="small-icon" />} options={meals.dinner} selected={dayChoices.dinner} onSelect={(choice) => chooseMeal("dinner", choice)} />
          <MealCard title="Night Snack" icon={<Moon className="small-icon" />} options={meals.night} selected={dayChoices.night} onSelect={(choice) => chooseMeal("night", choice)} />
        </div>

        <Card>
          <h3>Craving Rule</h3>
          <p>Water first. Wait 15 minutes. Still hungry? Protein only.</p>
        </Card>

        <Card>
          <div className="card-title">
            <Dumbbell className="small-icon" />
            <h3>Training</h3>
          </div>
          <p>3 lift days. Short Bowflex or walks. No hero sets. This is a reset, not a punishment week.</p>
        </Card>

        <button onClick={resetToday} className="reset-button">
          <RotateCcw className="small-icon" /> Reset Today
        </button>
      </div>
    </main>
  );
}
