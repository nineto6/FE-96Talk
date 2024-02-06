import { dotPulse } from "ldrs";

/**
 * 로딩 중 animation
 */
dotPulse.register();

/**
 * 로딩 화면 component
 * @returns
 */
export default function Loading() {
  return (
    <div
      className="fixed top-0 left-0 flex flex-col justify-center gap-4 items-center w-screen h-screen
        bg-themePurple z-50
    "
    >
      <l-dot-pulse size="43" speed="1.3" color="#EFC638" />
    </div>
  );
}
