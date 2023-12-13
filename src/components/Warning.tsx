interface IWarningProps {
  addFriend: Function;
}

export default function Warning({ addFriend }: IWarningProps) {
  return (
    <div className="text-slate-700 flex px-8 flex-row items-center justify-between absolute -bottom-14 bg-opacity-50 left-0 bg-violet-200 w-full h-14">
      <h2>
        친구로 등록되지 않은 사용자 입니다. 사용자로부터의 메시지에 주의하시기
        바랍니다. 해당 사용자를 친구로 추가하거나 관리자에게 문의해 주세요.
      </h2>

      <div
        onClick={() => {
          addFriend();
        }}
        className="flex flex-col justify-center items-center border-violet-500 border py-2 px-4 text-xs rounded-3xl bg-violet-500 text-violet-50 cursor-pointer"
      >
        <h2>친구 추가</h2>
      </div>
    </div>
  );
}
