import React, { useState, useEffect, useMemo } from 'react';

const formatCurrency = (value) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const GoalCalculator = () => {
  const [goalAmount, setGoalAmount] = useState('1000000');
  const [monthlyContribution, setMonthlyContribution] = useState('15000');
  const [interestRate, setInterestRate] = useState('12');

  const [result, setResult] = useState(null);

  useEffect(() => {
    const goal = parseFloat(goalAmount.replace(/,/g, ''));
    const monthly = parseFloat(monthlyContribution.replace(/,/g, ''));
    const rate = parseFloat(interestRate);

    if (isNaN(goal) || isNaN(monthly) || isNaN(rate) || goal <= 0 || monthly <= 0) {
      setResult(null);
      return;
    }

    let currentAmount = 0;
    let months = 0;
    const monthlyRate = rate / 100 / 12;
    const maxMonths = 1200; // 100 years safeguard

    const timeline = [];

    while (currentAmount < goal && months < maxMonths) {
      const interestEarned = currentAmount * monthlyRate;
      currentAmount += interestEarned + monthly;
      months++;
      
      // Store yearly milestones or last month
      if (months % 12 === 0 || currentAmount >= goal) {
         timeline.push({
             month: months,
             year: Math.ceil(months / 12),
             total: currentAmount,
             contribution: months * monthly,
             interest: currentAmount - (months * monthly)
         });
      }
    }

    if (months >= maxMonths) {
      setResult({ error: 'Goal unreachable within 100 years.' });
      return;
    }

    setResult({
      months,
      years: Math.floor(months / 12),
      remainingMonths: months % 12,
      timeline,
      totalContributions: months * monthly,
      totalInterest: currentAmount - (months * monthly),
      finalAmount: currentAmount
    });
  }, [goalAmount, monthlyContribution, interestRate]);

  return (
    <div className="calculator-container animate-slide-up">
      <div className="glass-panel main-panel">
        <h1 className="title text-gradient">Goal Timeline Calculator</h1>
        
        <div className="inputs-grid">
          <div className="form-group">
            <label>Target Goal Amount</label>
            <div className="input-wrapper">
              <span className="input-prefix">₹</span>
              <input 
                type="number"
                className="custom-input"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="1000000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Monthly Contribution</label>
            <div className="input-wrapper">
              <span className="input-prefix">₹</span>
              <input 
                type="number"
                className="custom-input"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expected Return Rate</label>
            <div className="input-wrapper">
              <input 
                type="number"
                className="custom-input with-suffix"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="12"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
        </div>

        {result && !result.error && (
          <div className="result-section">
            <div className="summary-card">
              <h2 className="time-highlight">
                <span className="text-gradient">
                  {result.years > 0 && `${result.years} Years `}
                  {result.remainingMonths > 0 && `${result.remainingMonths} Months`}
                </span>
              </h2>
              <p className="summary-text">to reach your goal of {formatCurrency(parseFloat(goalAmount))}</p>
              
              <div className="breakdown">
                <div className="breakdown-item">
                  <span className="dot contribution-dot"></span>
                  <div>
                    <span className="label">You Invest</span>
                    <span className="value">{formatCurrency(result.totalContributions)}</span>
                  </div>
                </div>
                <div className="breakdown-item">
                  <span className="dot interest-dot"></span>
                  <div>
                    <span className="label">Est. Returns</span>
                    <span className="value text-gradient">{formatCurrency(result.totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-visual">
              <h3>Growth Timeline</h3>
              <div className="progress-track">
                {/* Visual Bar representation */}
                <div 
                  className="progress-fill contribution-fill" 
                  style={{ width: `${(result.totalContributions / result.finalAmount) * 100}%` }}
                ></div>
                <div 
                  className="progress-fill interest-fill" 
                  style={{ width: `${(result.totalInterest / result.finalAmount) * 100}%` }}
                ></div>
              </div>
              <div className="timeline-markers">
                <span>Today</span>
                <span>{result.years > 0 ? `${result.years}y ${result.remainingMonths}m` : `${result.months} months`}</span>
              </div>
            </div>
            
            {/* Optional: Add a simple line graph/cards for milestones using CSS grids */}
            <div className="milestones-grid">
               {result.timeline.slice(0, 5).map((point, i) => (
                  <div key={i} className="milestone-card">
                     <span className="ms-year">Year {point.year}</span>
                     <span className="ms-value text-gradient">{formatCurrency(point.total)}</span>
                  </div>
               ))}
               {result.timeline.length > 5 && (
                  <div className="milestone-card">
                     <span className="ms-year">...</span>
                     <span className="ms-value">View More</span>
                  </div>
               )}
            </div>
            
          </div>
        )}
        
        {result?.error && (
           <div className="error-message">
              {result.error}
           </div>
        )}
      </div>
    </div>
  );
};

export default GoalCalculator;
