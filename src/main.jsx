import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, Watermark } from "antd";
import zhCN from "antd/locale/zh_CN";

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
        <Suspense
          fallback={
            <div
              style={{
                height: "100vh",
                width: "100vh",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <h1>RWRSG</h1>
            </div>
          }
        >
          <App />
        </Suspense>
      </Watermark>
    </ConfigProvider>
  </StrictMode>
);
