export default function ChatContainer({ children }) {
  return (
    <ul className="flex max-h-0 min-h-full w-full flex-col overflow-y-scroll">
      {children}
    </ul>
  );
}
