interface ISideTabBarProps {
  setIsTab: Function;
  deleteChatRoom: Function;
}

export default function SideTabBar({
  setIsTab,
  deleteChatRoom,
}: ISideTabBarProps) {
  return (
    <div className="bg-black bg-opacity-70 h-full w-full z-50 fixed flex flex-col justify-center items-end">
      <div
        className={`animate-slidein h-full shadow-xl flex flex-col justify-between items-center md:w-1/4 w-2/3 p-8 bg-themePurple opacity-none`}
      >
        <div className="flex flex-row items-center w-full justify-start mb-4 pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer text-slate-200"
            onClick={() => {
              setIsTab();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div
          className="rounded-2xl cursor-pointer w-full px-8 bg-themeDarkPurple p-4"
          onClick={() => {
            deleteChatRoom();
          }}
        >
          <div className="w-full flex flex-row justify-around items-center">
            <h2 className="text-slate-200 text-lg">채팅방 나가기</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-slate-200"
            >
              <path
                fillRule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
