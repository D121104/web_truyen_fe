import React from "react";
// import "../../styles/ClientLayout.scss";
import Header from "@/components/client/Header/Header";
// import Footer from "@/components/client/Footer/Footer";
import { Metadata } from "next";
import { App, ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import StyledComponentsRegistry from "@/lib/antd.registry";
import StoreProvider from "@/app/StoreProvider";
import LayoutApp from "@/components/layout/LayoutApp";
import { Footer } from "antd/es/layout/layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import socket from "@/utils/socket";

export const metadata: Metadata = {
  title: "Web Truyện",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo-light.png" type="image/png" />
      </head>
      <body className="next-wrapper" style={{ margin: 0 }}>
        <ToastContainer />
        <div className="next-container">
          <StoreProvider>
            <ConfigProvider
              locale={vi_VN}
              theme={{
                token: {
                  colorPrimary: "#17252A",
                  colorPrimaryHover: "#2B7A78",
                  colorPrimaryActive: "#17252A",
                  borderRadius: 13,
                },
                components: {
                  Button: {
                    colorPrimary: "#17252A",
                    colorPrimaryHover: "#2B7A78",
                    colorPrimaryActive: "#17252A",
                  },
                },
              }}
            >
              <App>
                <StyledComponentsRegistry>
                  <LayoutApp>
                    <Header />
                    {children}

                    <Footer />
                  </LayoutApp>
                </StyledComponentsRegistry>
              </App>
            </ConfigProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
