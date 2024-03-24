import { useMagic } from "../MagicProvider";
import showToast from "../../utils/showToast";
import Spinner from "../ui/Spinner";
import { RPCError, RPCErrorCode } from "magic-sdk";
import { LoginProps } from "../../utils/types";
import { saveToken } from "../../utils/common";
import { useState } from "react";

const EmailOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const handleLogin = async () => {
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setEmailError(true);
    } else {
      try {
        setLoginInProgress(true);
        setEmailError(false);
        const token = await magic?.auth.loginWithEmailOTP({ email });
        if (token) {
          saveToken(token, setToken, "EMAIL");
          setEmail("");
        }
      } catch (e) {
        console.log("login error: " + JSON.stringify(e));
        if (e instanceof RPCError) {
          switch (e.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
            case RPCErrorCode.MagicLinkExpired:
            case RPCErrorCode.MagicLinkRateLimited:
            case RPCErrorCode.UserAlreadyLoggedIn:
              showToast({ message: e.message, type: "error" });
              break;
            default:
              showToast({
                message: "Something went wrong. Please try again",
                type: "error"
              });
          }
        }
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  return (
    <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={(e) => {
                if (emailError) setEmailError(false);
                setEmail(e.target.value);
              }}
              placeholder={token.length > 0 ? "Already logged in" : "Email"}
              value={email}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {emailError && <span className="error">Enter a valid email</span>}
          </div>
        </div>

        <div>
          <button
            disabled={
              isLoginInProgress ||
              (token.length > 0 ? false : email.length == 0)
            }
            onClick={() => handleLogin()}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoginInProgress ? <Spinner /> : "Log in / Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailOTP;
