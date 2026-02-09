import tutorLogo from "../../assets/tutor.png";
import "./App.css";

function App() {
  const tutorLogoUrl =
    typeof tutorLogo === "string" ? tutorLogo : tutorLogo.src;
  const handleShowWidget = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;
    try {
      await browser.tabs.sendMessage(tab.id, { action: "show-widget" });
    } catch (error) {
      console.debug("Failed to show widget:", error);
    }
  };

  return (
    <>
      <div className="card">
        <img className="popup-logo" src={tutorLogoUrl} alt="Tutor" />
        <button onClick={handleShowWidget}>Show tutor widget</button>
        <p>Quick tip: open any LeetCode problem to start learning.</p>
      </div>
    </>
  );
}

export default App;
