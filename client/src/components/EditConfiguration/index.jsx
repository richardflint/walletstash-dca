import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../actions";
import ConfigurationForm from "../ConfigurationForm";
import {
  defaultExchanges,
  defaultInputSymbols,
  defaultOutputSymbols,
  defaultTradingPairs,
  emptyOption,
  extractExchanges,
  extractTradingPairs,
  marketSearch,
} from "../MarketSearch";

const getConfiguration = async (token, id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get(
    `/api/exchange-configurations/${id}`,
    config
  );
  return response.data;
};

const updateConfiguration = async (token, id, formProps, callback) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    await axios.put(`/api/exchange-configurations/${id}`, formProps, config);
    callback();
  } catch (e) {
    return { error: "Issue saving DCA configuration" };
  }
};

const EditConfiguration = ({ auth }) => {
  const [configuration, setConfiguration] = useState();
  const [inputSymbols, setInputSymbols] = useState(defaultInputSymbols);
  const [outputSymbols, setOutputSymbols] = useState(defaultOutputSymbols);
  const [tradingPairs, setTradingPairs] = useState(defaultTradingPairs);
  const [exchanges, setExchanges] = useState(defaultExchanges);
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    getConfiguration(auth.authenticated, id).then((data) => {
      setConfiguration(data);
    });
  }, [id, auth.authenticated]);

  useEffect(() => {
    if (configuration) {
      marketSearch(auth.authenticated, configuration).then((data) => {
        setTradingPairs([emptyOption, ...extractTradingPairs(data)]);
        setExchanges([emptyOption, ...extractExchanges(data)]);
      });
    }
  }, [auth.authenticated, configuration]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      name:
        data.inputSymbol +
        " -> " +
        data.exchangeKey +
        " -> " +
        data.outputSymbol,
    };
    updateConfiguration(auth.authenticated, id, formData, () => {
      navigate("/");
    });
  };

  const onMarketSearch = (formProps) => {
    const token = auth.authenticated;
    marketSearch(token, formProps).then((data) => {
      setTradingPairs([emptyOption, ...extractTradingPairs(data)]);
      setExchanges([emptyOption, ...extractExchanges(data)]);
    });
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit DCA
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ConfigurationForm
            onSubmit={onSubmit}
            initalValues={configuration}
            onMarketSearch={onMarketSearch}
            inputSymbols={inputSymbols}
            outputSymbols={outputSymbols}
            tradingPairs={tradingPairs}
            exchanges={exchanges}
          />
        </div>
      </main>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    auth: { authenticated: state.auth.authenticated },
  };
}

export default connect(mapStateToProps, actions)(EditConfiguration);
