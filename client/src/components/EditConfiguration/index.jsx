import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../actions";
import ConfigurationForm from "../ConfigurationForm";

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

const marketSearch = async (token, formProps) => {
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

const EditConfiguration = ({ auth, search, updateConfiguration, marketSearch }) => {
  const [configuration, setConfiguration] = useState();
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    getConfiguration(auth.authenticated, id).then((data) => {
      setConfiguration(data);
    });
  }, [id, auth.authenticated]);

  useEffect(() => {
    marketSearch(auth.authenticated, configuration);
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
    marketSearch(token, formProps);
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
            inputSymbols={search.inputSymbols}
            outputSymbols={search.outputSymbols}
            tradingPairs={search.tradingPairs}
            exchanges={search.exchanges}
          />
        </div>
      </main>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    auth: { authenticated: state.auth.authenticated },
    search: {
      inputSymbols: state.search.inputSymbols,
      outputSymbols: state.search.outputSymbols,
      tradingPairs: state.search.tradingPairs,
      exchanges: state.search.exchanges,
    },
  };
}

export default connect(mapStateToProps, actions)(EditConfiguration);
