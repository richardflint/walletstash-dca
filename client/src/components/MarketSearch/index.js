import axios from "axios";

export const marketSearch = async (token, formProps) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  let performSearch = false;

  let params = "";

  if (formProps) {
    if (formProps.inputSymbol) {
      params = params.concat(`inputSymbol=${formProps.inputSymbol}`);
      performSearch = true;
    }

    if (formProps.outputSymbol) {
      params = params.concat(`&outputSymbol=${formProps.outputSymbol}`);
      performSearch = true;
    }

    if (formProps.tradingPair) {
      params = params.concat(`&marketSymbol=${formProps.tradingPair}`);
      performSearch = true;
    }
  }

  if (performSearch) {
    const response = await axios.get(`/api/search?${params}`, config);
    return response.data;
  }
};

export const extractExchanges = (exchangePairs) => {
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
    .map((exchange) => ({ value: exchange.id, label: exchange.name }));
};

export const extractTradingPairs = (exchangePairs) => {
  const tradingPairs = new Set();

  exchangePairs.forEach((element) => {
    tradingPairs.add(element.market);
  });

  return Array.from(tradingPairs)
    .sort()
    .map((symbol) => ({ value: symbol, label: symbol }));
};

export const emptyOption = { value: "", label: "" };

export const defaultInputSymbols = [
  emptyOption,
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

export const defaultOutputSymbols = [
  emptyOption,
  { value: "BTC", label: "BTC" },
];

export const defaultTradingPairs = [];

export const defaultExchanges = [];
