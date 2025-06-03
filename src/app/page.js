import Image from "next/image";
import OTPInput from "./components/opt";
export default function Home() {
  var counter = 15*24*60*60 + 10*60*60 + 24*60 + 59;
  // This is a workaround to ensure the countdown is rendered after the component mounts

  if (typeof window !== "undefined") {
    // This code will only run on the client side
    counter = 15*24*60*60 + 10*60*60 + 24*60 + 59;
  }
  // The counter value is calculated as total seconds remaining
  // 15 days, 10 hours, 24 minutes, and 59 seconds
  // The countdown component will use this value to display the countdown

  return (
    <div >
      <OTPInput />
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={{"--value":15} /* as React.CSSProperties */ } aria-live="polite" aria-label={counter}>15</span>
    </span>
    days
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={{"--value":10} /* as React.CSSProperties */ } aria-live="polite" aria-label={counter}>10</span>
    </span>
    hours
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={{"--value":24} /* as React.CSSProperties */ } aria-live="polite" aria-label={counter}>24</span>
    </span>
    min
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={{"--value":59} /* as React.CSSProperties */ } aria-live="polite" aria-label={counter}>59</span>
    </span>
    sec
  </div>
</div>

  </div>
  );
}
