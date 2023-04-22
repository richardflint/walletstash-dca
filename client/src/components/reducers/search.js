import { SEARCH } from "../../actions/types";

const INITIAL_STATE = {
  inputSymbols: [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
  ],
  outputSymbols: [{ value: "BTC", label: "BTC" }],
  tradingPairs: [],
  exchanges: [],
  errorMessage: "",
};

const extractSymbols = (exchangePairs) => {
  const symbols = new Set();

  exchangePairs.forEach((element) => {
    symbols.add(element.base);
    symbols.add(element.quote);
  });

  return Array.from(symbols).sort().map(symbol => ({ value: symbol, label: symbol }));
};

const extractExchanges = (exchangePairs) => {
  const exchanges = new Set();

  exchangePairs.forEach((element) => {
    exchanges.add(
      JSON.stringify({
        id: element.exchangeId,
        name: element.exchangeName,
      })
    );
  });

  return Array.from(exchanges)
    .map((exchange) => JSON.parse(exchange))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(exchange => ({ value: exchange.id, label: exchange.name }));;
};

const extractTradingPairs = (exchangePairs) => {
  const tradingPairs = new Set();

  exchangePairs.forEach((element) => {
    tradingPairs.add(element.market);
  });

  return Array.from(tradingPairs).sort().map(symbol => ({ value: symbol, label: symbol }));
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        exchanges: extractExchanges(action.payload),
        tradingPairs: extractTradingPairs(action.payload),
        errorMessage: "",
      };
    default:
      return state;
  }
};

export default searchReducer;
