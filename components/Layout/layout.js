import s from "./layout.module.scss";
import Header from "../Header";
import Footer from "../Footer";
// import Head from "next/head";

const Layout = ({
  children,
  parentCategory,
  openCart,
  setOpenCart,
  categories,
}) => (
  <>
    <Header
      openCart={openCart}
      setOpenCart={setOpenCart}
      categories={categories}
      parentCategory={parentCategory}
    />
    <main className={s.wrapper}>{children}</main>
    <Footer />
  </>
);
export default Layout;
