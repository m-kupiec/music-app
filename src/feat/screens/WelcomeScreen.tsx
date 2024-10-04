function WelcomeScreen() {
  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center"
      data-testid="welcome-screen"
    >
      <header className="h-20 text-center">
        <h1 className="mb-4 text-4xl">Music App</h1>
        <p data-testid="spotify-account-connection-prompt">
          Please connect your Spotify account to proceed
        </p>
        <button
          className="text-spotify-black bg-spotify-green hover:bg-spotify-black hover:text-spotify-green mt-8 rounded-full px-8 py-2 transition-colors"
          data-testid="spotify-account-connection-button"
        >
          Connect Spotify Account
        </button>
      </header>
    </main>
  );
}

export default WelcomeScreen;
