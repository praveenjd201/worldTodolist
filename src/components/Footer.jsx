import styles from "./Footer.module.css";
function Footer() {
  return (
    <div className={styles.footer}>
      <p> @Copyrigt {new Date().getFullYear()} All rights reserved.</p>
    </div>
  );
}

export default Footer;
