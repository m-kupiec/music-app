function WelcomeScreen() {
  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center bg-spotify-black"
      data-testid="welcome-screen"
    >
      <header className="h-fit px-8 text-center text-spotify-white">
        <h1 className="mb-7 text-5xl font-semibold tracking-tighter">
          Music App
        </h1>
        <p data-testid="spotify-account-connection-prompt">
          Please connect your Spotify account to proceed.
        </p>
        <button
          className="text-spotify-black-text hover:bg-spotify-green-highlight mt-5 h-12 rounded-full bg-spotify-green px-8 font-semibold transition-colors"
          data-testid="spotify-account-connection-button"
        >
          Connect
        </button>
      </header>
    </main>
  );
}

export default WelcomeScreen;
