function WelcomeScreen() {
  return (
    <main
      className="flex h-screen flex-wrap content-center justify-center"
      data-testid="welcome-screen"
    >
      <header className="h-20 text-center">
        <h1 className="pb-4 text-4xl">Music App</h1>
        <p>Please connect your Spotify account to proceed</p>
      </header>
    </main>
  );
}

export default WelcomeScreen;
