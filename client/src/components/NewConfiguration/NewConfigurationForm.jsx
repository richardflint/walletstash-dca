import { withFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import SearchSelect from "./SearchSelect";
import Input from "./Input";

const emptyOption = { value: "", label: "" };

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    inputSymbol: Yup.object().shape({
      label: Yup.string(),
      value: Yup.string().required("inputSymbol is required!"),
    }),
    outputSymbol: Yup.object().shape({
      label: Yup.string(),
      value: Yup.string().required("outputSymbol is required!"),
    }),
    tradingPair: Yup.object().shape({
      label: Yup.string(),
      value: Yup.string().required("tradingPair is required!"),
    }),
    exchange: Yup.object().shape({
      label: Yup.string(),
      value: Yup.string().required("exchange is required!"),
    }),
    apiUsername: Yup.string().required("apiUsername is required!"),
    apiKey: Yup.string().required("apiKey is required!"),
    secretKey: Yup.string().required("secretKey is required!"),
  }),
  mapPropsToValues: (props) => ({
    inputSymbol: emptyOption,
    outputSymbol: emptyOption,
    tradingPair: emptyOption,
    exchange: emptyOption,
    apiUsername: "",
    apiKey: "",
    secretKey: "",
    customTradingThreshold: 0,
    customTradingParams: "",
    withdrawalEnabled: false,
    withdrawalSymbol: "",
    withdrawalAddress: "",
    withdrawalTag: "",
    customWithdrawThreshold: 0,
    customWithdrawParams: "",
  }),
  handleSubmit: (values, {setSubmitting, props: {onSubmit}}) => {
    const payload = {
      inputSymbol: values.inputSymbol.value,
      outputSymbol: values.outputSymbol.value,
      tradingPair: values.tradingPair.value,
      exchangeKey: values.exchange.value,
      apiUsername: values.apiUsername,
      apiKey: values.apiKey,
      secretKey: values.secretKey,
      customTradingThreshold: values.customTradingThreshold,
      customTradingParams: values.customTradingParams,
      withdrawalEnabled: values.withdrawalEnabled,
      withdrawalSymbol: values.withdrawalSymbol,
      withdrawalAddress: values.withdrawalAddress,
      withdrawalTag: values.withdrawalTag,
      customWithdrawThreshold: values.customWithdrawThreshold,
      customWithdrawParams: values.customWithdrawParams,
    };
    onSubmit(payload);
    setSubmitting(false);
  },
  displayName: "NewConfigurationForm",
});

const Form = ({
  values,
  touched,
  dirty,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  onMarketSearch,
  onSubmit,
  inputSymbols,
  outputSymbols,
  tradingPairs,
  exchanges,
}) => {
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
                      onChange={(field, value) => {
                        setFieldValue(field, value);
                        onMarketSearch({ ...values, inputSymbol: value });
                        setFieldValue("outputSymbol", emptyOption);
                        setFieldValue("tradingPair", emptyOption);
                        setFieldValue("exchange", emptyOption);
                      }}
                      onBlur={setFieldTouched}
                      error={errors.inputSymbol}
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
                      isDisabled={!values.inputSymbol.value}
                      options={outputSymbols}
                      value={values.outputSymbol}
                      onChange={(field, value) => {
                        setFieldValue(field, value);
                        onMarketSearch({ ...values, outputSymbol: value });
                        setFieldValue("tradingPair", emptyOption);
                        setFieldValue("exchange", emptyOption);
                      }}
                      onBlur={setFieldTouched}
                      error={errors.outputSymbol}
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
                      isDisabled={!values.outputSymbol.value}
                      options={tradingPairs}
                      value={values.tradingPair}
                      onChange={(field, value) => {
                        setFieldValue(field, value);
                        onMarketSearch({ ...values, tradingPair: value });
                        setFieldValue("exchange", emptyOption);
                      }}
                      onBlur={setFieldTouched}
                      error={errors.tradingPair}
                      touched={touched.tradingPair}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="exchangeKey"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Exchange Key
                    </label>
                    <SearchSelect
                      name="exchange"
                      isDisabled={!values.tradingPair.value}
                      options={exchanges}
                      value={values.exchange}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.exchange}
                      touched={touched.exchange}
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
                      touched={touched.exchange}
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
                      htmlFor="customTradingThreshold"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Trading Threshold
                    </label>
                    <Input
                      name="secretKey"
                      value={values.customTradingThreshold}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.customTradingThreshold}
                      touched={touched.customTradingThreshold}
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
                              value={values.withdrawalEnabled}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="checkbox"
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
                          htmlFor="customWithdrawThreshold"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Withdrawal Threshold
                        </label>
                        <Input
                          name="customWithdrawThreshold"
                          value={values.customWithdrawThreshold}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.customWithdrawThreshold}
                          touched={touched.customWithdrawThreshold}
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

const NewConfigurationForm = formikEnhancer(Form);

export default NewConfigurationForm;
