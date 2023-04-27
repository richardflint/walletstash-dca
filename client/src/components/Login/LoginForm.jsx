import React from "react";
import { Formik, Field, Form } from "formik";
import { LockClosedIcon } from "@heroicons/react/20/solid";

const LoginForm = ({ onSubmit, errorMessage }) => {
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        username: "",
        password: "",
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label className="sr-only">Username</label>
              <Field
                name="username"
                data-testid="username-input"
                placeholder="Username"
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <Field
                name="password"
                type="password"
                data-testid="password-input"
                placeholder="Password"
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </button>
            {errorMessage && (
              <span className="text-xs text-red-700">{errorMessage}</span>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
