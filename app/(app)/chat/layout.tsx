export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col -mb-20 md:-mb-8">
      {children}
    </div>
  );
}
