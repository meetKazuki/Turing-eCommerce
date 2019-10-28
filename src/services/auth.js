import axios from 'axios';
import { config } from 'dotenv';
import passport from 'passport';

import { Customer } from '../database/models';
import generateToken from '../helpers/auth';
import Response from '../helpers/response';

config();

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  REDIRECT_URL
} = process.env;

export const facebookAuth = async ({ accessToken }) => {
  const appAccessTokenURL = `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`;

  const { data: appAccessDetails } = await axios.get(appAccessTokenURL);
  const { access_token: appAccessToken } = appAccessDetails;

  const verifyUserAccessTokenURl = `
    https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`;

  const { data: verificationDetails } = await axios.get(verifyUserAccessTokenURl);
  const { is_valid: isValid, app_id: appId } = verificationDetails.data;

  if (FACEBOOK_APP_ID !== appId) {
    throw new Error(
      500,
      `Invalid app id: expected [${FACEBOOK_APP_ID}] but was [${appId}]`
    );
  }

  if (!isValid) {
    throw new Error(500, 'User access token is invalid');
  }

  const getUserDataURL = `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${accessToken}`;

  const { data: userData } = await axios.get(getUserDataURL);
  const { first_name: firstName, last_name: lastName, email } = userData;
  const { url: avatarUrl } = userData.picture.data;

  return {
    firstName,
    lastName,
    email,
    avatarUrl
  };
};

export const createOrFindUser = async ({ email }) => {
  try {
    const [user, created] = await Customer.findOrCreate({
      where: { email },
      defaults: {
        email,
        password: ''
      }
    });

    const { id, createdAt } = user;
    const token = generateToken(id);
    const userDetails = { id, email, createdAt };

    const status = created ? 201 : 200;
    return { status, data: { user: userDetails, token } };
  } catch (error) {
    return error;
  }
};
