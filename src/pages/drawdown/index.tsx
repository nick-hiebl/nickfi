import React, { useState, useEffect } from 'react';

import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

interface Situation {
  growthRate: number;
  incomeYield: number;
  requiredIncome: number;
  initialAssets: number;
  startingPrice: number;
  numYears: number;
}

interface State {
  units: number;
  unitPrice: number;
  cashBalance: number;
  returns: number;
}

const normalValue = (mean: number, sigma: number): number => {
  const mag = sigma * Math.sqrt(-2 * Math.log(Math.random()));
  return mag * Math.cos(2 * Math.PI * Math.random()) + mean;
};

const nextState = (situation: Situation, state: State): State => {
  const income = situation.incomeYield * state.unitPrice * state.units;
  const returns = situation.growthRate * Math.exp(normalValue(0, 0.05));
  const nextUnitPrice = state.unitPrice * returns;

  const endOfYearBalance = state.cashBalance + income;

  const needsBeyondCash = situation.requiredIncome - endOfYearBalance;

  if (needsBeyondCash > 0) {
    const neededToSell = Math.ceil(needsBeyondCash / nextUnitPrice);
  
    const finalCash = endOfYearBalance + neededToSell * nextUnitPrice - situation.requiredIncome;
  
    return {
      units: state.units - neededToSell,
      unitPrice: nextUnitPrice,
      cashBalance: finalCash,
      returns,
    };
  }

  const surplus = endOfYearBalance - situation.requiredIncome;

  const unitsBought = Math.floor(surplus / nextUnitPrice);

  return {
    units: state.units + unitsBought,
    unitPrice: nextUnitPrice,
    cashBalance: surplus - unitsBought * nextUnitPrice,
    returns,
  };
};

const generateData = (situation: Situation): State[] => {
  const canBuyUnits = Math.floor(situation.initialAssets / situation.startingPrice);
  const startingState = {
    units: canBuyUnits,
    unitPrice: situation.startingPrice,
    cashBalance: situation.initialAssets - canBuyUnits * situation.startingPrice,
    returns: 1,
  };

  const states = [startingState];

  let lastState = startingState;

  while (states.length <= situation.numYears) {
    const currentState = nextState(situation, lastState);

    states.push(currentState);

    lastState = currentState;
  }

  return states;
}

const defaultConfig = {
  growthRate: 1.04,
  incomeYield: 0.02,
  requiredIncome: 40000,
  initialAssets: 1000000,
  startingPrice: 500,
  numYears: 40,
};

let initialData = generateData(defaultConfig);

const numberConfig = {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export const DrawdownPage = () => {
  const [unitPrice, setUnitPrice] = useState('500');
  const [initialAssets, setInitialAssets] = useState('1000000');
  const [expenses, setExpenses] = useState('40000');
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(generateData({
      ...defaultConfig,
      initialAssets: parseFloat(initialAssets),
      startingPrice: parseFloat(unitPrice),
      requiredIncome: parseFloat(expenses),
    }));
  }, [expenses, initialAssets, unitPrice]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPrice(event.target.value);
  };

  const handleAssetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialAssets(event.target.value);
  };

  const handleExpensesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpenses(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h3">
        Drawdown simulator
      </Typography>
      <TextField id="unit-price" label="Starting unit price" value={unitPrice} onChange={handlePriceChange} />
      <TextField id="initial-assets" label="Initial assets" value={initialAssets} onChange={handleAssetsChange} />
      <TextField id="annual-expenses" label="Annual expenses" value={expenses} onChange={handleExpensesChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell align="right">Returns (%)</TableCell>
              <TableCell align="right">Number of units</TableCell>
              <TableCell align="right">Unit price ($)</TableCell>
              <TableCell align="right">Cash balance ($)</TableCell>
              <TableCell align="right">Total net worth ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const total = row.units * row.unitPrice + row.cashBalance;
              const s = total.toLocaleString(undefined, numberConfig);

              const returns = (row.returns - 1);
              return (
                <TableRow key={index}>
                  <TableCell align="left">{index}</TableCell>
                  <TableCell align="right">{returns.toLocaleString(undefined, { ...numberConfig, style: 'percent' })}</TableCell>
                  <TableCell align="right">{row.units}</TableCell>
                  <TableCell align="right">{row.unitPrice.toLocaleString(undefined, numberConfig)}</TableCell>
                  <TableCell align="right">{row.cashBalance.toLocaleString(undefined, numberConfig)}</TableCell>
                  <TableCell align="right">{s}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
