import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfigurationsTable from "./ConfigurationsTable";
import * as actions from "../../actions";

const Dashboard = ({
  auth,
  configurations,
  getConfigurations,
  deleteConfiguration,
}) => {
  let navigate = useNavigate();

  useEffect(() => {
    getConfigurations(auth.authenticated);
  }, []);

  const addNew = () => {
    navigate("/new-configuration");
  };

  const onDelete = (id) => {
    deleteConfiguration(auth.authenticated, id);
  };

  const onEdit = (id) => {
    navigate(`/configurations/${id}`);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            DCA configurations
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {!configurations.existing || configurations.existing.length === 0 ? (
            <>
              <p data-testid="no-configurations-message">No Configured DCAs</p>{" "}
              Try adding one{" "}
            </>
          ) : (
            <>
              <ConfigurationsTable
                configurations={configurations.existing}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </>
          )}
          <>
            <div className="bg-gray-50 px-4 py-3 text-left sm:px-6">
              <button
                data-testid="add-new-button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={addNew}
              >
                Add new
              </button>
            </div>
          </>
        </div>
      </main>
    </>
  );
};

function mapStateToProps(state) {
  return {
    auth: { authenticated: state.auth.authenticated },
    configurations: { existing: state.configurations.existing },
  };
}

export default connect(mapStateToProps, actions)(Dashboard);
