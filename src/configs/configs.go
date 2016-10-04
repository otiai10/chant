package configs

import "os"

// TwitterConsumerKey ...
func TwitterConsumerKey() string {
	return os.Getenv("TWITTER_CONSUMER_KEY")
}

// TwitterConsumerSecret ...
func TwitterConsumerSecret() string {
	return os.Getenv("TWITTER_CONSUMER_SECRET")
}

// JWTSecretSalt ...
func JWTSecretSalt() string {
	return os.Getenv("JWT_SECRET_SALT")
}

// JWTSigningMethod ...
func JWTSigningMethod() string {
	return os.Getenv("JWT_SIGNING_METHOD")
}
