interface IBubbleProps {
  text: string;
  speaker: boolean;
  //   말하는 사람이 본인인지
}

export default function Bubble({ text, speaker }: IBubbleProps) {
  return (
    <div
      className={`flex justify-end p-4 pb-0 w-full ${
        speaker ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div
        className={`p-4 rounded-lg ${
          speaker
            ? "bg-themeDarkPurple text-slate-200"
            : "bg-themePurple text-slate-200"
        }`}
      >
        <p className="break-all w-fit max-w-xs">{text}</p>
      </div>
    </div>
  );
}
