import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

const refreshToken = async (): Promise<string> => {
  const user: CognitoUser = await Auth.currentAuthenticatedUser();
  const currentSession = await Auth.currentSession();
  return new Promise<string>((resolve, reject) => {
    user.refreshSession(
      currentSession.getRefreshToken(),
      (err, session: CognitoUserSession) => {
        if (err) return reject(err);

        resolve(session.getIdToken().getJwtToken());
      }
    );
  });
};

export default refreshToken;
