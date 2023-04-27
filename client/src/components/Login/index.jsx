import { connect } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import * as actions from "../../actions";
import LoginForm from "./LoginForm";

const Login = (props) => {
  const navigate = useNavigate();

  const onSubmit = (formProps) => {
    props.login(formProps, () => {
      navigate("/");
    });
  };

  return (
    <div>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <header>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </header>
          <main>
            <LoginForm onSubmit={onSubmit} errorMessage={props.errorMessage} />
          </main>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default connect(mapStateToProps, actions)(Login);
