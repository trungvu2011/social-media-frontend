import { useState } from "react";
import Header from "./Header";
import CreatePost from "./CreatePost";

function HomePage() {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex flex-1 flex-col ">
      <Header feedType={feedType} setFeedType={setFeedType} />
      <CreatePost />
    </div>
  );
}

export default HomePage;
