import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../actions";
import NewConfigurationForm from "./NewConfigurationForm";

const NewConfiguration = ({
  auth,
  configuration,
  search,
  saveConfiguration,
  marketSearch,
  getConfiguration,
}) => {
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    getConfiguration(auth.authenticated, id);
  }, [id, getConfiguration, auth.authenticated]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      name: data.tradingPair + "/" + data.exchangeKey,
    };
    saveConfiguration(auth.authenticated, formData, () => {
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
          <NewConfigurationForm
            onMarketSearch={onMarketSearch}
            onSubmit={onSubmit}
            configuration={configuration}
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
    configuration: state.configuration,
  };
}

export default connect(mapStateToProps, actions)(NewConfiguration);
