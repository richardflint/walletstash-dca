import React from "react";
import { format } from 'date-fns'

const ConfigurationsTable = ({ configurations = [], onDelete, onEdit }) => {
  return (
    <table data-testid="configurations" className="min-w-full">
      <thead className="border-b bg-gray-50">
        <tr>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Name
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Input symbol
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Output symbol
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Lastest Trade
          </td>
          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Withdrawal enabled
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
              {configuration.inputSymbol}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.outputSymbol}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.latestConversion ? format(new Date(configuration.latestConversion.datetime), 'yyyy-MM-dd hh:mm') : '-'}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {configuration.withdrawalEnabled ? "Yes" : "No"}
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
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
