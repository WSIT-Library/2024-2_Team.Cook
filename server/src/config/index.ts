interface Config {
  port: string;
  frontEndOrigin: string;
  jwtSecretKey: string;
  mongodbPassword: string;
  mongodbName: string;
  googleOAuthRedirectUrl: string;
  googleOAuthClientId: string;
  googleOAuthSecret: string;
  clodinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

const config: Partial<Config> = {
  port: process.env.PORT,
  frontEndOrigin: process.env.FRONT_END_ORIGIN,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  mongodbPassword: process.env.MONGODB_ADMIN_PASSWORD,
  mongodbName: process.env.MONGODB_NAME,
  googleOAuthRedirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
  googleOAuthClientId: process.env.CLIENT_ID,
  googleOAuthSecret: process.env.CLIENT_SECRET,
  clodinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};

export default config;
