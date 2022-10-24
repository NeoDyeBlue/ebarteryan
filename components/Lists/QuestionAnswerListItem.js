export default function QuestionAnswerListItem() {
  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-medium">User Name</p>
        <p className="text-sm text-gray-300">1h ago</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-4">
          <span
            className="flex h-[24px] w-[24px] items-center justify-center 
          rounded-[5px] bg-info-500 font-display font-medium text-white"
          >
            Q
          </span>
          <p className="w-full rounded-[10px] border border-gray-100 p-4">
            Laborum nulla consectetur id sit cupidatat reprehenderit ex minim
            nulla pariatur non?
          </p>
        </div>
        <div className="flex items-start gap-4">
          <span
            className="flex h-[24px] w-[24px] items-center justify-center 
          rounded-[5px] bg-success-500 font-display font-medium text-white"
          >
            A
          </span>
          <p className="w-full rounded-[10px] border border-gray-100 p-4">
            Laborum nulla consectetur id sit cupidatat reprehenderit ex minim
            nulla pariatur non
          </p>
        </div>
      </div>
    </li>
  );
}
