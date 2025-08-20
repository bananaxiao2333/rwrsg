import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, Watermark } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#9cc321",
        },
      }}
      locale={zhCN}
    >
      <Watermark content={["RWR Store Generator"]}>
        <App />
      </Watermark>
    </ConfigProvider>
  </StrictMode>
);
