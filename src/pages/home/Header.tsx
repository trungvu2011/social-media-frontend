import { useI18n } from "../../context/I18nContex";

interface HeaderProps {
  feedType: string;
  setFeedType: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ feedType, setFeedType }: HeaderProps) {
  const i18n = useI18n();

  return (
    <header className="flex flex-row h-16 w-full bg-white border-b border-gray-200 px-6 py-3 relative">
      <div
        className={
          "flex justify-center h-16 flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
        }
        onClick={() => setFeedType("forYou")}
      >
        {i18n.t("For you")}
      </div>
      <div
        className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
        onClick={() => setFeedType("following")}
      >
        {i18n.t("Following")}
      </div>
      <div
        className={`absolute bottom-0 h-0.5 bg-[#4F46E5] w-[calc(50%_-_32px)] transition-all duration-300 ${
          feedType === "forYou" ? "left-4" : "left-[calc(50%_+_16px)]"
        }`}
      />
    </header>
  );
}

export default Header;
