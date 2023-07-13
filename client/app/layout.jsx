import "@styles/global.css";

export const metadata = {
  title: "Malaika",
  description: "Give life to that Idea",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <div className="container">
        <div className="gradient" />
        <main className="">{children}</main>
      </div>
    </html>
  );
};

export default RootLayout;
