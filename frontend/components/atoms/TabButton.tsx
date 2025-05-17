export function TabButton({
  originalType,
  type,
  setType,
}: {
  originalType: string;
  type: string;
  setType: any;
}) {
  return (
    <div
      className="flex flex-col cursor-pointer justify-center py-2"
      onClick={() => setType(originalType)}
    >
      <div
        className={`text-sm font-medium py-1 border-b-2 ${
          type === originalType
            ? "border-accentBlue text-baseTextHighEmphasis"
            : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"
        }`}
      >
        {originalType}
      </div>
    </div>
  );
}
