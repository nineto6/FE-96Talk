interface IMessengerProps {
  text: string;
  setIsError: Function;
}

export default function Messenger({ text, setIsError }: IMessengerProps) {
  return (
    <div className="bg-slate-500 bg-opacity-25 h-full w-full z-50 fixed flex flex-col justify-center items-center">
      <div
        className={`animate-bounce-up min-h-[40vh] rounded-md shadow-xl flex flex-col justify-start items-center w-2/3 h-auto p-8 bg-white opacity-none`}
      >
        <div className="flex flex-row items-center w-full justify-end mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              setIsError();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="flex flex-col justify-center items-center h-full w-full">
          <h2>{text}</h2>
        </div>
      </div>
    </div>
  );
}
