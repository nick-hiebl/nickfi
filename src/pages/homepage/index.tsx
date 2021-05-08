import React from 'react';

import { Container, Typography } from '@material-ui/core';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h3">Welcome to NickFI</Typography>
      <p>Hopefully the home of some interesting financial calculators/simulators.</p>
      <p>
        Nothing on this site is financial advice or even general advice. This site does not take
        into account a huge variety of factors in real life, and only attempts to model reality
        very broadly and non-specifically. Everything is idealistic and simplified, and results
        of models here are only representative of models on the randomly generated data, not real
        historical data, and absolutely not future data.
      </p>
    </Container>
  )
};

export default HomePage;
