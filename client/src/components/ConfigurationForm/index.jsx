import React, { useState, useEffect } from "react";
import Input from "./Input";
import SearchSelect from "./SearchSelect";
import * as Yup from "yup";

const formSchema = Yup.object().shape({
  inputSymbol: Yup.string().required("'I have' is required!"),
  outputSymbol: Yup.string().required("'I want' is required!"),
  tradingPair: Yup.string().required("Trading Pair is required!"),
  exchangeKey: Yup.string().required("Exchange is required!"),
  apiUsername: Yup.string().required("Api Username is required!"),
  apiKey: Yup.string().required("Api Key is required!"),
  secretKey: Yup.string().required("Api Secret is required!"),
  tradingThreshold: Yup.number(),
  customTradingParams: Yup.string(),
  withdrawalEnabled: Yup.boolean(),
  withdrawalSymbol: Yup.string().when("withdrawalEnabled", {
    is: true,
    then: (schema) => schema.required("Withdrawal Symbol is required!"),
  }),
  withdrawalAddress: Yup.string().when("withdrawalEnabled", {
    is: true,
    then: (schema) => schema.required("Withdrawal Address is required!"),
  }),
  withdrawalTag: Yup.string().when("withdrawalEnabled", {
    is: true,
    then: (schema) => schema.required("Withdrawal Tag is required!"),
  }),
  withdrawalThreshold: Yup.number(),
  customWithdrawParams: Yup.string(),
});

const Form = ({
  initalValues,
  onMarketSearch,
  inputSymbols,
  outputSymbols,
  tradingPairs,
  exchanges,
  onSubmit,
}) => {
  const [values, setValues] = useState({
    inputSymbol: "",
    outputSymbol: "",
    tradingPair: "",
    exchangeKey: "",
    apiUsername: "",
    apiKey: "",
    secretKey: "",
    tradingThreshold: 0,
    customTradingParams: "",
    withdrawalEnabled: false,
    withdrawalSymbol: "",
    withdrawalAddress: "",
    withdrawalTag: "",
    withdrawalThreshold: 0,
    customWithdrawParams: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValues({ ...values, ...initalValues });
  }, [initalValues]);

  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setValues({ ...values, [name]: value });
    handleError(name, { ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      let tempTouched = {};
      for (const key in values) {
        tempTouched = { ...tempTouched, [key]: true };
      }
      setTouched({ ...touched, ...tempTouched });
      await formSchema.validate(values, { abortEarly: false });
      onSubmit(values);
    } catch (error) {
      let collectedErrors = {};
      error.inner.forEach((error) => {
        collectedErrors = {
          ...collectedErrors,
          [error.path]: error.message,
        };
      });
      setErrors({ ...errors, ...collectedErrors });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (event) => {
    const name = event.target.name;
    setTouched({ ...touched, [name]: true });
    handleErrorValue(name);
  };

  const handleSelectBlur = (name) => {
    setTouched({ ...touched, [name]: true });
  };

  const handleError = (name, values) => {
    try {
      formSchema.validateSyncAt(name, values);
      setErrors({ ...errors, [name]: "" });
    } catch (error) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleErrorValue = (name) => {
    handleError(name, { [name]: values[name] });
  };

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="inputSymbol"
                      className="block text-sm font-medium text-gray-700"
                    >
                      I have
                    </label>
                    <SearchSelect
                      name="inputSymbol"
                      options={inputSymbols}
                      value={values.inputSymbol}
                      error={errors.inputSymbol}
                      onChange={(field, value) => {
                        setValues({
                          ...values,
                          exchangeKey: "",
                          tradingPair: "",
                          outputSymbol: "",
                          inputSymbol: value.value,
                        });
                        onMarketSearch({
                          ...values,
                          inputSymbol: value.value,
                          outputSymbol: "",
                          tradingPair: "",
                          exchangeKey: "",
                        });
                        handleError(field, {
                          inputSymbol: value.value,
                        });
                      }}
                      onBlur={handleSelectBlur}
                      touched={touched.inputSymbol}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="outputSymbol"
                      className="block text-sm font-medium text-gray-700"
                    >
                      I want
                    </label>
                    <SearchSelect
                      name="outputSymbol"
                      isDisabled={!values.inputSymbol}
                      options={outputSymbols}
                      value={values.outputSymbol}
                      error={errors.outputSymbol}
                      onChange={(field, value) => {
                        setValues({
                          ...values,
                          exchangeKey: "",
                          tradingPair: "",
                          outputSymbol: value.value,
                        });
                        onMarketSearch({
                          ...values,
                          outputSymbol: value.value,
                          tradingPair: "",
                          exchangeKey: "",
                        });
                        handleError(field, {
                          outputSymbol: value.value,
                        });
                      }}
                      onBlur={handleSelectBlur}
                      touched={touched.outputSymbol}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="tradingPair"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Trading Pair
                    </label>
                    <SearchSelect
                      name="tradingPair"
                      isDisabled={!values.outputSymbol}
                      options={tradingPairs}
                      value={values.tradingPair}
                      error={errors.tradingPair}
                      onChange={(field, value) => {
                        setValues({
                          ...values,
                          exchangeKey: "",
                          tradingPair: value.value,
                        });
                        onMarketSearch({
                          ...values,
                          tradingPair: value.value,
                          exchangeKey: "",
                        });
                        handleError(field, {
                          tradingPair: value.value,
                        });
                      }}
                      onBlur={handleSelectBlur}
                      touched={touched.tradingPair}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="exchangeKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Exchange
                    </label>
                    <SearchSelect
                      name="exchangeKey"
                      isDisabled={!values.tradingPair}
                      options={exchanges}
                      value={values.exchangeKey}
                      error={errors.exchangeKey}
                      onChange={(field, value) => {
                        setValues({
                          ...values,
                          exchangeKey: value.value,
                        });
                        handleError(field, {
                          exchangeKey: value.value,
                        });
                      }}
                      onBlur={handleSelectBlur}
                      touched={touched.exchangeKey}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="apiUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Api Username
                    </label>
                    <Input
                      name="apiUsername"
                      isDisabled={false}
                      value={values.apiUsername}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.apiUsername}
                      touched={touched.apiUsername}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="apiKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Api Key
                    </label>
                    <Input
                      name="apiKey"
                      value={values.apiKey}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.apiKey}
                      touched={touched.apiKey}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="secretKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Api Secret
                    </label>
                    <Input
                      name="secretKey"
                      value={values.secretKey}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.secretKey}
                      touched={touched.secretKey}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="tradingThreshold"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Trading Threshold
                    </label>
                    <Input
                      name="tradingThreshold"
                      value={values.tradingThreshold}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.tradingThreshold}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="customTradingParams"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Custom Trading Params
                    </label>
                    <Input
                      name="customTradingParams"
                      value={values.customTradingParams}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.customTradingParams}
                      touched={touched.customTradingParams}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div
                    className="hidden sm:block col-span-6"
                    aria-hidden="true"
                  >
                    <div className="py-5">
                      <div className="border-t border-gray-200" />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <fieldset>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              name="withdrawalEnabled"
                              onChange={() => {
                                setValues({
                                  ...values,
                                  withdrawalEnabled: !values.withdrawalEnabled,
                                });
                              }}
                              type="checkbox"
                              checked={!!values.withdrawalEnabled}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-700"
                            >
                              Enable Withdrawals
                            </label>
                            <p className="text-gray-500">
                              Automatically perform withdrawals
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {values.withdrawalEnabled && (
                    <>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="withdrawalSymbol"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Symbol
                        </label>
                        <Input
                          name="withdrawalSymbol"
                          value={values.withdrawalSymbol}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.withdrawalSymbol}
                          touched={touched.withdrawalSymbol}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="withdrawalAddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Address
                        </label>
                        <Input
                          name="withdrawalAddress"
                          value={values.withdrawalAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.withdrawalAddress}
                          touched={touched.withdrawalAddress}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="withdrawalTag"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Tag
                        </label>
                        <Input
                          name="withdrawalTag"
                          value={values.withdrawalTag}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.withdrawalTag}
                          touched={touched.withdrawalTag}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="withdrawalThreshold"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Threshold
                        </label>
                        <Input
                          name="withdrawalThreshold"
                          value={values.withdrawalThreshold}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.withdrawalThreshold}
                          touched={touched.withdrawalThreshold}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="customWithdrawParams"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Custom Withdraw Params
                        </label>
                        <Input
                          name="customWithdrawParams"
                          value={values.customWithdrawParams}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.customWithdrawParams}
                          touched={touched.customWithdrawParams}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-white px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;
