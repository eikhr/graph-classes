"use client";

import { usePathname } from "next/navigation";
import styles from "./nav.module.css";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles["nav"]}>
      <div className={styles["inner"]}>
        <a href="/" className={styles["brand"]}>
          Graph Classes
        </a>
        <div className={styles["links"]}>
          <a
            href="/"
            className={`${styles["link"]} ${pathname === "/" ? styles["active"] : ""}`}
          >
            Classes
          </a>
          <a
            href="/hierarchy"
            className={`${styles["link"]} ${pathname === "/hierarchy" ? styles["active"] : ""}`}
          >
            Hierarchy
          </a>
        </div>
      </div>
    </nav>
  );
}
