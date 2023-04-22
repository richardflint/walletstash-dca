import React from "react";

const ConfigurationsTable = ({ configurations = [], onDelete, onEdit }) => {
  return (
    <table data-testid="configurations" className="min-w-full">
      <thead className="border-b bg-gray-50">
        <tr>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Name
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Exchange
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Input symbol
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Output symbol
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Trading pair
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Withdraw symbol
          </td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {configurations.map((configuration) => (
          <tr key={configuration.id} className="border-b">
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.name}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.exchangeKey}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.inputSymbol}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.outputSymbol}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.tradingPair}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.withdrawalSymbol}
            </td>
            <td>
              <button
                data-testid="edit-button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => onEdit(configuration.id)}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                data-testid="delete-button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => onDelete(configuration.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConfigurationsTable;
